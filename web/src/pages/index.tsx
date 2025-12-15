import { Link } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mic, MessageCircle, Users, Sparkles, Headphones, AudioWaveform, ArrowRight, Play, CheckCircle } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Index = () => {
  return (
    <div className="">
      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-20 pb-32 md:px-12 md:pt-32">
        <motion.div 
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="max-w-5xl mx-auto text-center"
        >
          <motion.div 
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary">Professional Audio Recording Made Simple</span>
          </motion.div>
          
          <motion.h1 
            variants={fadeInUp}
            className="text-4xl md:text-7xl font-bold text-foreground leading-tight mb-6"
          >
            Record. <span className="text-primary">Learn.</span> Master.
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            The ultimate audio studio with real-time coaching. Record professional-quality audio 
            and get instant feedback from expert coaches.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/studio">
              <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg">
                <Play className="w-5 h-5 mr-2" />
                Start Exploring
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-border hover:bg-secondary px-8 py-6 text-lg">
              Watch Demo
            </Button>
          </motion.div>
        </motion.div>

        {/* Floating elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="absolute top-40 left-10 hidden lg:block"
        >
          <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center shadow-lg shadow-primary/10">
            <Mic className="w-8 h-8 text-primary" />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute top-60 right-20 hidden lg:block"
        >
          <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center shadow-lg shadow-primary/10">
            <Headphones className="w-7 h-7 text-primary" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-24 md:px-12 bg-gradient-to-b from-transparent to-card/30">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Professional tools and real-time coaching in one powerful platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Mic,
                title: "Pro Recording",
                description: "Crystal-clear audio capture with real-time waveform visualization and professional processing."
              },
              {
                icon: MessageCircle,
                title: "Live Coaching",
                description: "Connect with expert coaches in real-time. Get instant feedback to improve your technique."
              },
              {
                icon: Users,
                title: "Community",
                description: "Join a supportive community of learners and coaches. Share, learn, and grow together."
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative p-8 rounded-2xl bg-card/50 border border-border hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 px-6 py-24 md:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Get started in minutes with our simple workflow
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Record", description: "Hit record and capture your audio with professional quality" },
              { step: "02", title: "Review", description: "Playback your recordings and analyze the waveforms" },
              { step: "03", title: "Connect", description: "Join a coaching room and connect with an expert" },
              { step: "04", title: "Improve", description: "Get real-time feedback and level up your skills" }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-bold text-primary/20 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing/Benefits */}
      <section className="relative z-10 px-6 py-24 md:px-12 bg-gradient-to-b from-transparent to-card/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center p-12 rounded-3xl bg-card border border-border relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Everything you need to record, learn, and master audio production.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {["Free to start", "No credit card required", "Unlimited recordings"].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <Link to="/studio">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-6 text-lg">
                  Launch VocalStudio
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;