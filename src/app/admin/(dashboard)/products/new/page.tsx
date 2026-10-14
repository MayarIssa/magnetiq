import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800">New Product</h1>
      <div className="mt-6">
        <ProductForm />
      </div>
    </div>
  );
}
