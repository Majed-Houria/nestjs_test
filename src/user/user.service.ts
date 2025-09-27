import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

async create(createUserDto: CreateUserDto): Promise<User> {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+com$/;
  if (!emailRegex.test(createUserDto.email)) {
    throw new BadRequestException({
      message: 'البريد الإلكتروني غير صالح. يجب أن ينتهي بـ .com',
      details: { attemptedEmail: createUserDto.email },
    });
  }

  if (!createUserDto.name) {
    throw new BadRequestException({
      message: 'لا يمكن أن يكون الاسم فارغ',
      details: createUserDto,
    });
  }

  const userExists = await this.userModel.findOne({ name: createUserDto.name });
  if (userExists) {
    throw new BadRequestException({
      message: 'اسم المستخدم موجود مسبقًا',
      details: { attemptedName: createUserDto.name },
    });
  }

  try {
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  } catch (error) {
    throw new BadRequestException({
      message: 'حدث خطأ أثناء إنشاء المستخدم',
      details: error,
    });
  }
}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException({
        message: 'معرّف المستخدم غير صالح',
      });
    }

    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException({
        message: 'المستخدم غير موجود',
        details: { attemptedId: id }
      });
    }

    return user;
  }


  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('معرّف المستخدم غير صالح');
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('المستخدم غير موجود');
    }

    return updatedUser;
  }

  async remove(id: string): Promise<User> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('معرّف المستخدم غير صالح');
    }

    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException('المستخدم غير ');
    }

    return deletedUser;
  }
}
///
