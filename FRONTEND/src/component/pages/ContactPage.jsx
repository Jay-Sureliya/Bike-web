import React, { useState } from "react";

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:3000/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setSubmitted(true);
                setFormData({ name: "", email: "", subject: "", message: "" });
            } else {
                alert("Submission failed.");
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("Error submitting form.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 font-sans">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Contact Us</h1>
            <p className="text-gray-600 mb-10">
                Have a question, feedback, or inquiry? We’d love to hear from you.
            </p>

            {submitted ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded">
                    Thank you! Your message has been sent.
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            autoComplete="off"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            autoComplete="off"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Subject</label>
                        <input
                            type="text"
                            name="subject"
                            required
                            autoComplete="off"
                            value={formData.subject}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea
                            name="message"
                            required
                            rows="5"
                            autoComplete="off"
                            value={formData.message}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-md transition"
                    >
                        Send Message
                    </button>
                </form>
            )}
        </div>
    );
};

export default ContactPage;
