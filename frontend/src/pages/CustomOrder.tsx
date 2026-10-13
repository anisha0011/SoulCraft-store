import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UploadCloud, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { customOrdersApi } from '../api';

const customOrderSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  productType: z.string().min(2, 'Product type is required'),
  occasion: z.string().min(2, 'Occasion is required'),
  budget: z.string().min(1, 'Budget is required'),
  requiredDate: z.string().min(1, 'Required date is required'),
  description: z.string().min(10, 'Please provide more details about your idea'),
});

type CustomOrderFormValues = z.infer<typeof customOrderSchema>;

export default function CustomOrder() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [requestId, setRequestId] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<CustomOrderFormValues>({
    resolver: zodResolver(customOrderSchema),
  });

  const onSubmit = async (data: CustomOrderFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await customOrdersApi.create(data);
      setRequestId(response.id);
      setIsSuccess(true);
    } catch (error) {
      console.error("Failed to submit custom order", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-[#FFF9FB] min-h-screen py-20 px-4">
        <div className="container mx-auto max-w-2xl bg-white rounded-3xl p-10 md:p-16 text-center shadow-sm border border-[#F0DDE4]">
          <div className="w-20 h-20 bg-[#FCE7EF] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-[#E8A0B8]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3A2930] mb-4">
            Your idea has been received! 💗
          </h2>
          <p className="text-[#806B73] mb-8 text-lg">
            Our craft team will review your request and contact you shortly with a quote and timeline.
          </p>
          <div className="bg-[#FFF5F8] p-6 rounded-xl inline-block mb-10 border border-[#F0DDE4]">
            <p className="text-sm text-[#806B73] mb-1">Your Request ID</p>
            <p className="font-mono font-bold text-xl text-[#3A2930]">{requestId}</p>
          </div>
          <div>
            <Button onClick={() => window.location.href = '/'}>Return Home</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF9FB] min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#3A2930] mb-4">Have Something Special in Mind?</h1>
          <p className="text-[#806B73] text-lg max-w-2xl mx-auto">
            Tell us your idea and we'll bring it to life. Fill out the form below with as much detail as possible.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-[#F0DDE4] overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12">
            
            <h3 className="font-serif text-2xl font-semibold text-[#3A2930] mb-6">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <Input 
                label="Full Name" 
                placeholder="Priya Sharma" 
                {...register('customerName')} 
                error={errors.customerName?.message}
              />
              <Input 
                label="Email Address" 
                type="email" 
                placeholder="priya@example.com" 
                {...register('email')} 
                error={errors.email?.message}
              />
              <Input 
                label="Phone Number" 
                type="tel" 
                placeholder="9876543210" 
                {...register('phone')} 
                error={errors.phone?.message}
              />
            </div>

            <h3 className="font-serif text-2xl font-semibold text-[#3A2930] mb-6">Project Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Input 
                label="Product Type" 
                placeholder="e.g., Resin Keychain, Quilled Frame" 
                {...register('productType')} 
                error={errors.productType?.message}
              />
              <Input 
                label="Occasion" 
                placeholder="e.g., Wedding, Birthday" 
                {...register('occasion')} 
                error={errors.occasion?.message}
              />
              <Input 
                label="Estimated Budget (₹)" 
                placeholder="e.g., 1500" 
                {...register('budget')} 
                error={errors.budget?.message}
              />
              <Input 
                label="Required By Date" 
                type="date" 
                {...register('requiredDate')} 
                error={errors.requiredDate?.message}
              />
            </div>
            
            <div className="mb-8">
              <label className="block text-sm font-medium text-[#3A2930] mb-1.5">Description & Idea</label>
              <textarea 
                className={`flex w-full rounded-md border ${errors.description ? 'border-[#D9536F] focus-visible:ring-[#D9536F]' : 'border-[#F0DDE4] focus-visible:ring-[#E8A0B8]'} bg-white px-3 py-2 text-sm placeholder:text-[#806B73] focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px]`}
                placeholder="Describe your idea in detail. Colors, themes, materials, names to be included, etc."
                {...register('description')}
              />
              {errors.description && <p className="mt-1.5 text-sm text-[#D9536F]">{errors.description.message}</p>}
            </div>

            <div className="mb-10">
              <label className="block text-sm font-medium text-[#3A2930] mb-1.5">Reference Images (Optional)</label>
              <div className="border-2 border-dashed border-[#F0DDE4] rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#FFF5F8] transition-colors">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 text-[#E8A0B8]">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="font-medium text-[#3A2930] mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-[#806B73]">PNG, JPG, or PDF (max. 10MB)</p>
                {/* Mock file input */}
                <input type="file" className="hidden" multiple accept="image/*,.pdf" />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full md:w-auto px-12">
                Submit Custom Request
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
