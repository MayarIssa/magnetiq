import { PackageForm } from "@/components/admin/PackageForm";

export default function NewPackagePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800">New Package</h1>
      <div className="mt-6">
        <PackageForm />
      </div>
    </div>
  );
}
