import { Card } from "../components/ui/card";
import {Button} from "../components/ui/button";

export function ContactPage() {
    return(
        <div className="min-h-screen bg-gradient-to-b from-purple-50 via-violet-50 to-white">
            <section className="bg-gradient-to-r from-purple-800 via-violet-700 to-purple-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-5xl mb-6">Contact us</h1>
                        <p className="text-xl max-w-3xl mx-auto opacity-95">
                            We would love to hear from you! Whether you have questions, want to get involved, or just want to say hello, 
                            feel free to reach out to us. Our team is here to assist you and provide any information you may need. Don't hesitate to contact us through the form below.
                        </p>
                    </div>
                </div>
            </section>
            <section className="py-16">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Card className="p-10">
                        <form className="space-y-6">
                            <div>

                                <label htmlFor="name" className="block text-sm font-medium text-gray-800">Name</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    name="name" 
                                    placeholder="Full name" 
                                    required 
                                    className="mt-2 block w-full rounded-md py-2 px-3 border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                                 />
                            </div>
                            <div>
                            <label htmlFor="topic" className="block text-sm font-medium text-gray-800">Topic</label>
                                <select
                                    id="topic"
                                    name="topic"
                                    className="mt-2 block w-full rounded-md py-2 px-3 border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50">
                                    <option value="">Select an option</option>
                                    <option value="general">General Inquiry</option>
                                    <option value="support">Support</option>
                                    <option value="feedback">Feedback</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    placeholder="email@example.com" 
                                    required 
                                    className="mt-2 block w-full rounded-md py-2 px-3 border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50" 
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    placeholder = "Let us know what you think!"
                                    required
                                    rows={5}
                                    className="mt-2 block w-full rounded-md px-3 py-2 border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                                />
                            </div>
                            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md">
                                Send Message
                            </Button>
                        </form>
                    </Card>
                </div>
            </section>
        </div>
    )
}