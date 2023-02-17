import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './product.model';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async all(): Promise<ProductDocument[]> {
    return await this.productModel.find().exec();
  }

  async create(data: Product): Promise<Product> {
    return await new this.productModel(data).save();
  }

  async findOne(id: number): Promise<Product> {
    return await this.productModel.findOne({ id });
  }

  async update(id: number, data: Product): Promise<object> {
    return await this.productModel.findOneAndUpdate({ id }, data);
  }

  async delete(id: number): Promise<void> {
    await this.productModel.findOneAndDelete({ id });
  }
}
