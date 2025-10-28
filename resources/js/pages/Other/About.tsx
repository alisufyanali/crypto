import { Head } from '@inertiajs/react';
import Header from '@/components/header';
import { Users, Target, Zap, Heart } from 'lucide-react';

export default function About() {
    const values = [
        {
            icon: Target,
            title: 'Our Mission',
            description: 'To deliver innovative solutions that transform businesses and create lasting impact in the digital world.',
        },
        {
            icon: Zap,
            title: 'Innovation',
            description: 'We embrace cutting-edge technologies and creative thinking to solve complex challenges.',
        },
        {
            icon: Users,
            title: 'Team Excellence',
            description: 'Our diverse team of experts brings passion, expertise, and dedication to every project.',
        },
        {
            icon: Heart,
            title: 'Customer First',
            description: 'Your success is our priority. We build relationships based on trust and mutual growth.',
        },
    ];

    return (
        <>
            <Head title="About Us" />
            <Header />

            {/* Main Content */}
            <div className="min-h-screen bg-gray-50 py-12 bg-hero">
                <div className="   px-4 sm:px-6 lg:px-8">
                    {/* Hero Section */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold text-brandblue mb-4">About Us</h1>
                            <div className="w-24 h-1 bg-brandblue mx-auto mb-6"></div>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                We are a team of passionate professionals dedicated to creating exceptional digital experiences 
                                that drive growth and innovation for businesses worldwide.
                            </p>
                        </div>

                        {/* Story Section */}
                        <div className="prose prose-lg max-w-none mb-12">
                            <h2 className="text-2xl font-bold text-brandblue mb-4">Our Story</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Founded with a vision to bridge the gap between technology and business needs, we've grown 
                                from a small startup to a trusted partner for companies across various industries. Our journey 
                                has been driven by one core belief: technology should empower, not complicate.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                Today, we continue to push boundaries, explore new technologies, and deliver solutions that 
                                make a real difference. Every project we undertake is an opportunity to innovate, learn, and 
                                create value for our clients.
                            </p>
                        </div>

                        {/* Values Grid */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-brandblue mb-8 text-center">What Drives Us</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {values.map((value, index) => {
                                    const Icon = value.icon;
                                    return (
                                        <div 
                                            key={index}
                                            className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border-2 border-blue-100 hover:border-brandblue transition-all duration-300 hover:shadow-lg"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0">
                                                    <div className="w-12 h-12 bg-brandblue rounded-lg flex items-center justify-center">
                                                        <Icon className="w-6 h-6 text-white" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-semibold text-brandblue mb-2">
                                                        {value.title}
                                                    </h3>
                                                    <p className="text-gray-600 leading-relaxed">
                                                        {value.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Stats Section */}
                        <div className="bg-gradient-to-r from-brandblue to-blue-700 rounded-xl p-8 text-white">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                                <div>
                                    <div className="text-4xl font-bold mb-2">500+</div>
                                    <div className="text-blue-100">Projects Completed</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-bold mb-2">200+</div>
                                    <div className="text-blue-100">Happy Clients</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-bold mb-2">50+</div>
                                    <div className="text-blue-100">Team Members</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-bold mb-2">10+</div>
                                    <div className="text-blue-100">Years Experience</div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="mt-12 text-center">
                            <h3 className="text-2xl font-bold text-brandblue mb-4">
                                Ready to Work Together?
                            </h3>
                            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                                Let's discuss how we can help transform your ideas into reality and drive your business forward.
                            </p>
                            <a 
                                href="/contact" 
                                className="inline-block bg-brandblue hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                            >
                                Get In Touch
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}