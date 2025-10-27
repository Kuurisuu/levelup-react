import React from 'react';

interface ProductRankingProps {
  products: Array<{
    name: string;
    sales: number;
    percentage: number;
  }>;
}

const ProductRanking: React.FC<ProductRankingProps> = ({ products }) => {
  return (
    <div className="top-products">
      {products.map((product, index) => (
        <div key={index} className="product-item">
          <span className="product-name">{product.name}</span>
          <div className="product-bar">
            <div 
              className="product-fill" 
              style={{ width: `${product.percentage}%` }}
            ></div>
          </div>
          <span className="product-count">{product.sales} ventas</span>
        </div>
      ))}
    </div>
  );
};

export default ProductRanking;
