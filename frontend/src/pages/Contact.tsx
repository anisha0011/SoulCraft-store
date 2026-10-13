import { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { toast } from '../store/useToastStore';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.warning('Please fill in required fields');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      toast.success('Message Sent! 💌', 'Thank you for reaching out. We will get back to you within 24 hours.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 600);
  };

  return (
    <div className="bg-[#FFF9FB] min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#3A2930] mb-4">Get in Touch</h1>
          <p className="text-[#806B73] text-lg max-w-2xl mx-auto">We'd love to hear from you. Reach out with any questions about our handmade products or custom requests.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl border border-[#F0DDE4] text-center flex flex-col items-center shadow-sm">
            <div className="w-12 h-12 bg-[#FFF5F8] text-[#E8A0B8] rounded-full flex items-center justify-center mb-4">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="font-serif font-semibold text-lg text-[#3A2930] mb-2">Email Us</h3>
            <p className="text-[#806B73]">hello@soulcraft.in</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-[#F0DDE4] text-center flex flex-col items-center shadow-sm">
            <div className="w-12 h-12 bg-[#FFF5F8] text-[#E8A0B8] rounded-full flex items-center justify-center mb-4">
              <Phone className="h-6 w-6" />
            </div>
            <h3 className="font-serif font-semibold text-lg text-[#3A2930] mb-2">Call Us</h3>
            <p className="text-[#806B73]">+91 98765 43210</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-[#F0DDE4] text-center flex flex-col items-center shadow-sm">
            <div className="w-12 h-12 bg-[#FFF5F8] text-[#E8A0B8] rounded-full flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="font-serif font-semibold text-lg text-[#3A2930] mb-2">Visit Studio</h3>
            <p className="text-[#806B73]">Mumbai, Maharashtra</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#F0DDE4]">
          <h2 className="font-serif text-2xl font-bold text-[#3A2930] mb-6">Send a Message</h2>
          
          {isSent ? (
            <div className="text-center py-10 bg-[#FFF5F8] rounded-2xl p-8 border border-[#F0DDE4]">
              <div className="w-16 h-16 bg-white text-[#4F9D69] rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif font-semibold text-[#3A2930] mb-2">Thank You!</h3>
              <p className="text-[#806B73] max-w-md mx-auto mb-6">Your message has been sent successfully. We usually respond within 24 hours.</p>
              <Button onClick={() => setIsSent(false)} variant="outline">Send Another Message</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Your Name" 
                placeholder="Priya Sharma" 
                required 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input 
                label="Email Address" 
                type="email" 
                placeholder="priya@example.com" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input 
                label="Subject" 
                className="md:col-span-2" 
                placeholder="Question about custom order" 
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
              <div className="md:col-span-2 mb-2">
                <label className="block text-sm font-medium text-[#3A2930] mb-1.5">Message *</label>
                <textarea 
                  className="flex w-full rounded-md border border-[#F0DDE4] bg-white px-3 py-2 text-sm placeholder:text-[#806B73] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A0B8] min-h-[150px]"
                  placeholder="Type your message here..."
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>
              <Button type="submit" isLoading={isSubmitting} className="md:col-span-2 w-full sm:w-auto self-start px-8">
                Send Message
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
