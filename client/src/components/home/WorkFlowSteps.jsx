import { FaRegEdit, FaMagic, FaBriefcase } from "react-icons/fa";
import Title from "./Title";
import { LuZap } from "react-icons/lu";

export default function WorkFlowSteps() {
    const steps = [
        {
            icon: <FaRegEdit size={28} />,
            title: "You fill out the order form",
            description: "Provide your details, experience, and career goals.",
        },
        {
            icon: <FaMagic size={28} />,
            title: "We make you shine",
            description: "We craft and optimize your resume professionally.",
        },
        {
            icon: <FaBriefcase size={28} />,
            title: "You get more interviews",
            description: "Stand out and increase your chances of getting hired.",
        },
    ];

    return (
        <div className="flex flex-col items-center my-10 scroll-mt-12 mb-28">
            {/* <h2 className="text-base font-semibold text-slate-900 text-center mb-10">
        How It Works
      </h2> */}
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-400/10 rounded-full px-6 py-1.5">
                <LuZap width={14} />
                <span>Working process</span>
            </div>

            <Title title='Our working process' />

            <div className="flex flex-col md:flex-row items-center justify-center gap-8 px-4 mt-8 ">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center text-center max-w-xs hover:scale-105 transition-all"
                    >
                        {/* Icon */}
                        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
                            {step.icon}
                        </div>

                        {/* Step Number */}
                        <div className="text-sm text-gray-400 mb-1 ">
                            Step {index + 1}
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-semibold text-slate-700">
                            {step.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-slate-600 max-w-xs">
                            {step.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
