import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { ProductDTO } from './product.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject('PRODUCT_SERVICE') private readonly client: ClientProxy,
  ) {}

  async all(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async save(data: ProductDTO): Promise<Product> {
    const product: Product = await this.productRepository.save(data);
    this.client.emit('product_created', product);
    return product;
  }

  async findById(id: number): Promise<Product> {
    return await this.productRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: number, data: ProductDTO): Promise<Product> {
    await this.productRepository.update(id, data);
    const product: Product = await this.productRepository.findOne({
      where: {
        id,
      },
    });
    this.client.emit('product_updated', product);
    return product;
  }

  async delete(id: number): Promise<number> {
    await this.productRepository.delete(id);
    this.client.emit('product_deleted', id);
    return id;
  }
}
