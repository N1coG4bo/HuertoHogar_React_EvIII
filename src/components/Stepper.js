// Componente Stepper para navegación paso a paso
import React, { useState, useContext, createContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StepperContext = createContext();

export function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  stepCircleContainerClassName = '',
  stepContainerClassName = '',
  contentClassName = '',
  footerClassName = '',
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = 'Atrás',
  nextButtonText = 'Continuar',
  completeButtonText = 'Completar',
  disableStepIndicators = false,
}) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  
  const steps = React.Children.toArray(children).filter(
    (child) => child.type?.name === 'Step'
  );
  const totalSteps = steps.length;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      onStepChange(nextStep);
    } else {
      onFinalStepCompleted();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      onStepChange(prevStep);
    }
  };

  const goToStep = (step) => {
    if (!disableStepIndicators && step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
      onStepChange(step);
    }
  };

  return (
    <StepperContext.Provider value={{ currentStep, totalSteps, goToStep }}>
      <div className="stepper-container">
        {/* Indicadores de paso */}
        <div className={`step-indicators mb-4 ${stepContainerClassName}`}>
          <div className={`d-flex justify-content-between align-items-center ${stepCircleContainerClassName}`}>
            {steps.map((_, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber === currentStep;
              const isCompleted = stepNumber < currentStep;

              return (
                <React.Fragment key={stepNumber}>
                  <div
                    className={`step-circle ${
                      isActive ? 'active' : isCompleted ? 'completed' : ''
                    } ${!disableStepIndicators ? 'cursor-pointer' : ''}`}
                    onClick={() => goToStep(stepNumber)}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      transition: 'all 0.3s',
                      backgroundColor: isActive || isCompleted ? '#198754' : '#e9ecef',
                      color: isActive || isCompleted ? 'white' : '#6c757d',
                      cursor: disableStepIndicators ? 'default' : 'pointer',
                    }}
                  >
                    {isCompleted ? '✓' : stepNumber}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className="step-connector flex-grow-1 mx-2"
                      style={{
                        height: '2px',
                        backgroundColor: stepNumber < currentStep ? '#198754' : '#e9ecef',
                        transition: 'background-color 0.3s',
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Contenido del paso actual */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className={contentClassName}
          >
            {steps[currentStep - 1]}
          </motion.div>
        </AnimatePresence>

        {/* Botones de navegación */}
        <div className={`d-flex justify-content-between mt-4 ${footerClassName}`}>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleBack}
            disabled={currentStep === 1}
            {...backButtonProps}
          >
            {backButtonText}
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={handleNext}
            {...nextButtonProps}
          >
            {currentStep === totalSteps ? completeButtonText : nextButtonText}
          </button>
        </div>
      </div>
    </StepperContext.Provider>
  );
}

export function Step({ children, title }) {
  return (
    <div className="step-content">
      {title && <h3 className="mb-3">{title}</h3>}
      {children}
    </div>
  );
}

export function useStepper() {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error('useStepper must be used within a Stepper component');
  }
  return context;
}
