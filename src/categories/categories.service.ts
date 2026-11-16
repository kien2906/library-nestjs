import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { Category } from './entities/category.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesModule } from './categories.module.js';
import { Not, Repository } from 'typeorm';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>) { }




  async create(createCategoryDto: CreateCategoryDto) {

    const category = await this.categoryRepository.findOne({
      where: {
        name: createCategoryDto.name
      }
    })

    if (category) {
      throw new BadRequestException("Category exists")
    }
 
    const newCategory = this.categoryRepository.create({
      name: createCategoryDto.name,
      createdAt: new Date(),
      updateAt: new Date()
    });

    this.categoryRepository.save(newCategory)

    return {
      message: "Create category successfully",
      newCategory
    }



  }

  findAll() {
    return this.categoryRepository.find();
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({
      where: {
        id: id
      }
    })

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const exists = await this.categoryRepository.findOne({
      where: {
        name: updateCategoryDto.name,
        id: Not(id)
      }
    })

    if (exists) {
      throw new BadRequestException('Name exists')
    }

    const category = await this.categoryRepository.findOne({
      where: {
        id
      }
    })

    if (!category) {
      throw new NotFoundException("category not found")
    }

    category.name = updateCategoryDto.name || category.name
     this.categoryRepository.save(category)
    return {
      message: "Update Category successfully",
      category
    }



  }

  async remove(id: string) {

    const category = await this.categoryRepository.findOne({
      where: {
        id
      }
    })

    if (!category) {
      throw new NotFoundException("category not found")
    }
    // delete là xóa trực tiếp cần truyền id 
     await this.categoryRepository.delete(id)
    return {
      message: "Delete Category successfully"

    }

  }
}
