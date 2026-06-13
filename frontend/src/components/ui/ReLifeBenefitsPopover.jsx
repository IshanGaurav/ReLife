import React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { ShieldCheck, Leaf, FileText, Lock, PiggyBank } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReLifeBenefitsPopover({ children, isOpen }) {
  return (
    <Popover.Root open={isOpen}>
      <Popover.Anchor asChild>
        {children}
      </Popover.Anchor>
      
      <AnimatePresence>
        {isOpen && (
          <Popover.Portal forceMount>
            <Popover.Content 
              side="right" 
              sideOffset={24}
              className="z-50 hidden md:block outline-none" 
              asChild
            >
              <motion.div
                initial={{ opacity: 0, x: -15, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -15, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="w-80 bg-white/95 backdrop-blur-xl border border-[#B8E2C4] rounded-2xl shadow-2xl p-6"
              >
                <h4 className="font-bold text-[#0F1111] text-lg mb-5 border-b border-gray-100 pb-2">Why choose ReLife?</h4>
                
                <div className="space-y-5">
                  <div className="flex items-start">
                    <ShieldCheck className="w-5 h-5 mr-3 text-[#16a34a] flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-bold text-[#0F1111]">Quality Checked</h5>
                      <p className="text-xs text-[#565959] mt-0.5">Professionally inspected and tested.</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Leaf className="w-5 h-5 mr-3 text-[#16a34a] flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-bold text-[#0F1111]">Lower Environmental Impact</h5>
                      <p className="text-xs text-[#565959] mt-0.5">Extends product life and reduces e-waste.</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FileText className="w-5 h-5 mr-3 text-[#16a34a] flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-bold text-[#0F1111]">Digital Passport</h5>
                      <p className="text-xs text-[#565959] mt-0.5">View product history and refurbishment details.</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Lock className="w-5 h-5 mr-3 text-[#16a34a] flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-bold text-[#0F1111]">Trusted & Secure</h5>
                      <p className="text-xs text-[#565959] mt-0.5">Protected by ReLife warranty and secure transactions.</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <PiggyBank className="w-5 h-5 mr-3 text-[#16a34a] flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-bold text-[#0F1111]">Smart Savings</h5>
                      <p className="text-xs text-[#565959] mt-0.5">Get the same product at a lower cost.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Popover.Content>
          </Popover.Portal>
        )}
      </AnimatePresence>
    </Popover.Root>
  );
}
