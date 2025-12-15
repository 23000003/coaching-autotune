import { Outlet, useLocation } from "react-router"
import { Link } from "react-router"
import { motion } from "framer-motion";
import { ArrowRight, AudioWaveform } from "lucide-react";
import { Button } from "./ui/button";

const Layout = () => {

  const location = useLocation();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12"
      >
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <AudioWaveform className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-bold text-foreground">VocalStudio</span>
        </div>
        {location.pathname !== "/studio" ? (
          <Link to="/studio">
            <Button variant="outline" className="border-primary/30 hover:bg-primary/10">
              Launch Studio
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        ) : (
          <Link to="/">
            <Button variant="outline" className="border-primary/30 hover:bg-primary/10">
              Back to Home
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        )}
      </motion.nav>
      <Outlet />
      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 md:px-12 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <AudioWaveform className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold text-foreground">VocalStudio</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 VocalStudio. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout;