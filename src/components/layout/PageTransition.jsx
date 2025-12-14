import { motion } from 'framer-motion';

const variants = {
    initial: {
        opacity: 0,
        scale: 0.98,
        filter: 'blur(10px)'
    },
    animate: {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        transition: {
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1] // Custom refined easing
        }
    },
    exit: {
        opacity: 0,
        scale: 1.02,
        filter: 'blur(10px)',
        transition: {
            duration: 0.3,
            ease: 'easeIn'
        }
    }
};

const PageTransition = ({ children, className }) => {
    return (
        <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
