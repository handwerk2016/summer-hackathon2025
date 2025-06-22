import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const typewriter = document.querySelector('.typewriter');
    if (typewriter) {
      setTimeout(() => {
        (typewriter as HTMLElement).style.animation = 'none';
        (typewriter as HTMLElement).style.borderRight = 'none';
        (typewriter as HTMLElement).style.whiteSpace = 'normal';
      }, 3500);
    }

    const debuggerBtn = document.querySelector('.debugger-box button');
    if (debuggerBtn) {
      debuggerBtn.addEventListener('click', function() {
        const resultBox = document.querySelector('.debugger-box .bg-white');
        if (resultBox) {
          (resultBox as HTMLElement).style.display = 'block';
        }
      });
    }
  }, []);

  const handleStartProject = () => {
    router.push('/auth');
  };

  const features = [
    {
      icon: 'lightbulb',
      title: 'Project Generator',
      description: 'AI creates a personalized project for you, just like a real internship assignment with clear goals, stages, and deliverables.',
    },
    {
      icon: 'list-check',
      title: 'Task Breakdown',
      description: 'Each project is broken down into manageable tasks with deadlines, just like in a professional work environment.',
    },
    {
      icon: 'brain',
      title: 'Mental Debugger',
      description: "When you're stuck, AI helps identify mental blocks and provides exercises to overcome them.",
    },
  ];

  const stages = [
    {
      number: 1,
      title: 'Research Phase',
      description: 'Investigate 3 existing solutions and analyze their UX patterns.',
      due: 'Tomorrow',
    },
    {
      number: 2,
      title: 'Design MVP',
      description: 'Create 2 key screens showing the core user flow.',
      due: 'In 3 days',
    },
    {
      number: 3,
      title: 'User Testing',
      description: 'Conduct a test with 1 person and document your findings.',
      due: 'In 5 days',
    },
  ];

  return (
    <>
      <Head>
        <title>PBLift - AI Mentor for Project-Based Learning</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <main>
        {/* Hero Section */}
        <section className="gradient-bg">
          <div className="max-w-[1400px] mx-auto">
            <nav className="px-16 py-4 flex justify-between items-center animate-fade-up">
              <div className="flex items-center space-x-2 glow-effect">
                <i className="fas fa-brain text-2xl text-white"></i>
                <span className="text-xl font-bold text-white">PBLift</span>
              </div>
              <div className="flex space-x-8 text-white">
                {['Home', 'Features', 'My Projects', 'Community'].map((item) => (
                  <a key={item} href="#" className="nav-link hover:text-gray-200">{item}</a>
                ))}
              </div>
            </nav>

            <div className="px-16 pt-32 pb-24 flex justify-between items-start">
              <div className="w-1/2">
                <h1 className="text-6xl font-bold text-white mb-6 animate-fade-up" style={{ animationDelay: '0.3s' }}>
                  Turn Learning<br />
                  Into A Personal<br />
                  Internship
                </h1>
                <p className="text-white/70 text-xl mb-12 max-w-xl animate-fade-up" style={{ animationDelay: '0.5s' }}>
                  With PBLift, you don't just learn - you design, act and reprogram yourself like in real work experience.
                </p>
                <div className="flex gap-4 animate-fade-up" style={{ animationDelay: '0.7s' }}>
                  <button 
                    onClick={handleStartProject}
                    className="button-primary bg-white text-primary font-bold py-4 px-8 rounded-full"
                  >
                    Start Your Project
                  </button>
                  <button className="button-primary border-2 border-white text-white font-bold py-4 px-8 rounded-full">
                    How It Works
                  </button>
                </div>
              </div>
              <div className="w-1/2 flex justify-end animate-slide-in" style={{ animationDelay: '0.6s' }}>
                <div className="bg-white rounded-2xl p-6 w-[480px] chat-message">
                  <div className="chat-message-inner">
                    <div className="chat-message-header">
                      <div className="chat-message-avatar">
                        <i className="fas fa-robot"></i>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">AI Mentor</h3>
                        <p className="text-sm text-gray-500">Just now</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">
                      Let's create your personalized internship project! What would you like to learn today?
                    </p>
                    <div className="chat-message-content">
                      <p className="text-gray-600 italic">
                        "I want to learn UX design but don't know what to create. Everything seems already done."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-[1400px] mx-auto px-16">
            <div className="grid grid-cols-3 gap-16">
              {features.map((feature, index) => (
                <div key={feature.title} 
                     className="text-center feature-card p-8 rounded-2xl animate-fade-up" 
                     style={{ animationDelay: `${0.3 + index * 0.2}s` }}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-6 feature-icon">
                    <i className={`fas fa-${feature.icon}`}></i>
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Project Example Section */}
        <section className="py-20">
          <div className="max-w-[1400px] mx-auto px-16">
            <h2 className="text-3xl font-bold text-center mb-12 animate-fade-up">
              Your Personalized Internship Project
            </h2>
            <div className="max-w-4xl mx-auto animate-scale-in">
              <div className="gradient-bg text-white p-6 rounded-t-2xl">
                <h3 className="text-2xl font-bold">UX Design Internship Project</h3>
                <p className="opacity-70">Created just for you based on your learning goals</p>
              </div>
              <div className="bg-white rounded-b-2xl p-6 shadow-lg">
                <div className="mb-8">
                  <h4 className="font-bold text-xl mb-4">Project Brief</h4>
                  <p className="text-gray-600">
                    You're an intern in a product team. Your assignment is to design a mobile UX for an online magazine with audio commenting functionality.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-6">Project Stages</h4>
                  <div className="space-y-6">
                    {stages.map((stage, index) => (
                      <div key={stage.title} 
                           className="pl-4 border-l-4 border-primary stage-item animate-fade-up"
                           style={{ animationDelay: `${0.3 + index * 0.2}s` }}>
                        <div className="flex items-start">
                          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-4">
                            {stage.number}
                          </div>
                          <div>
                            <h5 className="font-bold mb-2">{stage.title}</h5>
                            <p className="text-gray-600 mb-2">{stage.description}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <i className="far fa-calendar mr-2"></i>
                              <span>Due: {stage.due}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mental Debugger Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-20">Mental Debugger</h2>
            <div className="max-w-3xl mx-auto debugger-box bg-gray-50 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                  <i className="fas fa-exclamation text-xl"></i>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold">I'm stuck!</h3>
                  <p className="text-gray-500">Describe what you're feeling</p>
                </div>
              </div>

              <textarea 
                className="w-full p-6 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white mb-6" 
                rows={4} 
                placeholder="I feel like I'm doing nonsense. Why am I even doing this project?"
              ></textarea>

              <button className="gradient-bg text-white px-8 py-4 rounded-full hover:opacity-90 transition mb-8 w-full md:w-auto">
                Analyze My Thinking
              </button>

              <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary shrink-0">
                    <i className="fas fa-brain text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xl font-bold mb-4">Cognitive Pattern Detected</h4>
                    <p className="text-gray-600 mb-6">
                      This is the "If I didn't invent Google, it's meaningless" thinking pattern.
                    </p>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                      <p className="text-gray-700">
                        ⛓ This is "total result" thinking - evaluating work only by its potential for massive impact.
                      </p>
                    </div>
                    <h5 className="font-bold text-lg mb-4">Suggested Reframe:</h5>
                    <p className="text-gray-600 mb-6">
                      Let's evaluate your progress on three scales: growth → skill → completion.
                    </p>
                    <div className="bg-green-50 border-l-4 border-green-400 p-4">
                      <p className="text-gray-700">
                        ✍ Exercise: Rewrite why you're doing this project in the form of "In order to..." (focus on value).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-20">What Learners Say</h2>
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {[
                {
                  name: "Sarah K.",
                  role: "UX Design Student",
                  text: "PBLift transformed how I learn. Instead of just watching tutorials, I now have real projects in my portfolio that helped me land my first internship.",
                  stars: 5
                },
                {
                  name: "Mark T.",
                  role: "Aspiring Developer",
                  text: "The mental debugger is a game-changer. When I felt stuck, it helped me understand it was perfectionism holding me back, not my abilities.",
                  stars: 4.5
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-lg transform hover:-translate-y-1 transition duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center text-white">
                      <i className="fas fa-user text-xl"></i>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-xl font-bold">{testimonial.name}</h4>
                      <p className="text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6 text-lg leading-relaxed">"{testimonial.text}"</p>
                  <div className="flex text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <i key={i} className={`fas fa-star${i + 1 > testimonial.stars && testimonial.stars % 1 === 0 ? '-half-alt' : ''}`}></i>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="gradient-bg py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-indigo-600/20"></div>
          <div className="container mx-auto px-6 relative">
            <div className="text-center text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to Transform Your Learning?</h2>
              <p className="text-xl mb-12 max-w-2xl mx-auto opacity-90">
                Start building real projects with AI mentorship today.
              </p>
              <a href="#start" className="bg-white text-primary font-bold py-4 px-8 rounded-full hover:bg-opacity-90 transition duration-300 text-lg inline-block">
                Create Your First Project - It's Free
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <i className="fas fa-brain text-2xl text-primary"></i>
                <span className="text-xl font-bold">PBLift</span>
              </div>
              <p className="text-gray-400">
                Turning learning into personal internships with AI mentorship.
              </p>
            </div>
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Examples"]
              },
              {
                title: "Resources",
                links: ["Blog", "Community", "Help Center"]
              },
              {
                title: "Connect",
                social: true
              }
            ].map((section, index) => (
              <div key={index}>
                <h4 className="font-bold text-lg mb-6">{section.title}</h4>
                {section.social ? (
                  <>
                    <div className="flex space-x-4 mb-6">
                      {["twitter", "linkedin-in", "discord"].map((platform) => (
                        <a key={platform} href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition">
                          <i className={`fab fa-${platform}`}></i>
                        </a>
                      ))}
                    </div>
                    <p className="text-gray-400">hello@pblift.com</p>
                  </>
                ) : (
                  <ul className="space-y-3">
                    {section.links?.map((link) => (
                      <li key={link}>
                        <a href="#" className="text-gray-400 hover:text-white transition">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2024 PBLift. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
} 