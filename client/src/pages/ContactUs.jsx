import { useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import Hero from "../components/home/Hero";
import NavBar from "../components/home/NavBar";
import toast from "react-hot-toast";

export default function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
   toast.success("Message sent successfully! We will get back to you shortly.");
    setForm({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <>
    {/* <NavBar /> */}
       <div id='contact-us' className='flex flex-col items-center my-10 scroll-mt-12'>
    <section className="py-14 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 bg-white shadow-lg rounded-2xl p-8">
        
        {/* LEFT: Info */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Contact Us</h2>
          <p className="text-gray-500">
            Have questions or need help? Reach out and we’ll get back to you shortly.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-green-600" />
              <span>support@yourapp.com</span>
            </div>

            <div className="flex items-center gap-3">
              <FaPhoneAlt className="text-green-600" />
              <span>+91 7976204889</span>
            </div>

            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-green-600" />
              <span>New Delhi, India</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows="4"
              className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Write your message..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
    </div>
    </>
  );
}
