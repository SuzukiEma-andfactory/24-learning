import { z } from 'zod';

// Productオブジェクトの形式をチェック
const productSchema = z.object({
  sku: z.string().regex(/^[A-Z]{3}-\d{4}$/),
  price: z.number().int().positive(),
  expirationDate: z.string().refine((date) => new Date(date) > new Date(), {
    message: 'Expiration date must be a valid future date',
  }),
});

// productSchemaの構造に基づいた型Productを生成
type Product = z.infer<typeof productSchema>;

function somethingProduct(product: Product) {
  // Do something...
}

// バリデーション実行
const parsed = productSchema.parse({
  sku: '1234',
  price: -50,
  expirationDate: '2000-01-01',
});

somethingProduct(parsed);
