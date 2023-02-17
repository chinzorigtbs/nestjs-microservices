import { Controller, Get, Param, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { EventPattern } from '@nestjs/microservices';
import { Product } from './product.model';
import { HttpService } from '@nestjs/axios';

@Controller('products')
export class ProductController {
  constructor(
    private productService: ProductService,
    private httpService: HttpService,
  ) {}

  @EventPattern('product_created')
  async productCreated(data: Product) {
    await this.productService.create(data);
  }

  @EventPattern('product_updated')
  async productUpdated(product: Product) {
    await this.productService.update(product.id, product);
  }

  @EventPattern('product_deleted')
  async productDeleted(id: number) {
    await this.productService.delete(id);
  }

  @Get()
  async all() {
    return await this.productService.all();
  }

  @Post(':id/like')
  async like(@Param('id') id: number) {
    const product = await this.productService.findOne(id);
    product.likes += 1;
    await this.httpService
      .post(`http://localhost:8000/api/products/${id}/like`, {})
      .subscribe((res) => {
        console.log(res);
      });

    return await this.productService.update(id, product);
  }
}
