import { Employee } from "./../employee/entities/employee.entity";
import { ConflictException, ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import * as argon from "argon2";
import { plainToClass } from "class-transformer";
import { IOptionCommon } from "src/interfaces/common";
import { PrismaService } from "../prisma/prisma.service";
import { EditUserDto } from "./dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { GetUserDto } from "./dto/get-user.dto";
import { UserEntity } from "./entities/user.entity";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto, options?: IOptionCommon) {
    const prisma = options?.prismaTransaction || this.prisma;
    const usernameUnique = await prisma.user.count({
      where: {
        username: createUserDto.username
      }
    });
    if (usernameUnique) {
      throw new ConflictException("Username đã tồn tại. Vui lòng thử lại!");
    }

    const emailUnique = await prisma.user.count({
      where: {
        email: createUserDto.email
      }
    });
    if (emailUnique) {
      throw new ConflictException("Email đã được sử dụng. Vui lòng thử lại!");
    }

    const hash = await argon.hash(createUserDto.password);
    const user = await prisma.user
      .create({
        data: {
          username: createUserDto.username,
          email: createUserDto.email,
          password: hash,
          name: createUserDto.name,
          role: createUserDto.role
        }
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new ForbiddenException("Credentials incorrect");
          }
        }
        throw error;
      });

    return plainToClass(UserEntity, user);
  }

  async changePasswordUser(uid: number, newPassword: string): Promise<boolean> {
    const hash = await argon.hash(newPassword);
    await this.prisma.user.updateMany({
      where: {
        id: uid
      },
      data: {
        password: hash
      }
    });
    return true;
  }

  async findById(userId: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId
      },
      include: {
        Employee: true
      }
    });

    if (user.role === "ADMIN") {
      return user;
    }
    const data = {
      id: user.id,
      hashedRt: user.hashedRt,
      name: user.name,
      email: user.email,
      active: user.active,
      role: user.role,
      Employee: {
        id: user.Employee.id,
        image: user.Employee.image,
        position: user.Employee.position,
        restaurantId: user.Employee.restaurantId
      }
    };
    return data;
  }

  async editUser(userId: number, dto: EditUserDto): Promise<UserEntity> {
    const existUser = await this.prisma.user.count({
      where: {
        id: userId
      }
    });
    if (!existUser) {
      throw new ConflictException("Tài khoản không tồn tại!");
    }

    if (dto.email) {
      const emailUnique = await this.prisma.user.count({
        where: {
          email: dto.email,
          NOT: {
            id: userId
          }
        }
      });
      if (emailUnique) {
        throw new ConflictException("Email đã được sử dụng. Vui lòng thử lại!");
      }
    }
    const user = await this.prisma.user
      .update({
        where: {
          id: userId
        },
        data: {
          ...dto
        }
      })
      .catch((error) => {
        throw error;
      });
    return plainToClass(UserEntity, user);
  }

  // get user list
  async getUserList(query: GetUserDto) {
    const { page = 1, size = 10, q, teamId, active, role, name } = query;
    const skip = (page - 1) * size;
    const queryCustom = {
      skip,
      take: +size,
      where: {
        teamId,
        active: typeof active === "number" ? !!active : undefined,
        role,
        name: {
          contains: name
        }
      }
    };
    if (q) {
      queryCustom.where["OR"] = {
        OR: [
          {
            name: {
              contains: q
            }
          },
          {
            username: {
              contains: q
            }
          },
          {
            email: {
              contains: q
            }
          },
          {
            phoneNumber: {
              contains: q
            }
          }
        ]
      };
    }
    const [total, userList] = await Promise.all([
      this.prisma.user.count({ where: queryCustom.where }),
      this.prisma.user.findMany({
        ...queryCustom
      })
    ]);
    return {
      data: plainToClass(UserEntity, <any[]>userList),
      pagination: {
        total,
        page,
        size,
        pageCount: Math.ceil(parseInt(total + "") / size)
      }
    };
  }

  async deleteUser(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
