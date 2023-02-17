import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async all(): Promise<Product[]> {
    return await this.productService.all();
  }

  @Post()
  async create(
    @Body('title') title: string,
    @Body('image') image: string,
  ): Promise<Product> {
    return await this.productService.save({ title, image });
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<Product> {
    return await this.productService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body('title') title: string,
    @Body('image') image: string,
  ): Promise<Product> {
    return await this.productService.update(id, { title, image });
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<number> {
    return await this.productService.delete(id);
  }

  @Post(':id/like')
  async like(@Param('id') id: number): Promise<Product> {
    const product = await this.productService.findById(id);
    product.likes += 1;
    return await this.productService.update(id, product);
  }
}
