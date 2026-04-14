import { useState } from "react";
 import { FaEye, FaTimes } from "react-icons/fa";
// import ClassicTemplate from "../templates/ClassicTemplate";
// import ModernTemplate from "../templates/ModernTemplate";
// import MinimalTemplate from "../templates/MinimalTemplate";
// import MinimalImageTemplate from "../templates/MinimalImageTemplate";
import classic from '../../assets/Classic.png';
import modern from '../../assets/modern.png';
import minimal from '../../assets/minimal.png';
import minimalImage from '../../assets/MinimalwithImage.png';
import Title from "./Title";
import { LuBookUser, LuLayers } from "react-icons/lu";
// import { dummyResumeData } from '../../assets/assets';





export default function TemplatePreview() {
    const dummyResumeData = {
        // ----------------------------------------------------- Resume 1 ------------------------------------------------------
        personal_info: {
            full_name: "Alex Smith",
            email: "alex@example.com",
            phone: "0 123456789",
            location: "NY, USA",
            linkedin: "https://www.linkedin.com",
            website: "https://www.example.com",
            profession: "Full Stack Developer",
            image: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
        },
        _id: "68d2a31a1c4dd38875bb037e",
        userId: "68c180acdf1775dfd02c6d87",
        title: "Alex's Resume",
        public: true,
        professional_summary: "Highly analytical Data Analyst with 6 years of experience transforming complex datasets into actionable insights using SQL, Python, and advanced visualization tools. ",
        skills: ["JavaScript", "React JS", "Full Stack Development", "Git", "GitHub", "NextJS", "Express", "NodeJS", "TypeScript"],
        experience: [
            {
                company: "Example Technologies.",
                position: "Senior Full Stack Developer",
                start_date: "2023-06",
                end_date: "Present",
                description: "Architected, developed, and deployed innovative full-stack applications at Example Technologies.\ncreating robust back-end systems and intuitive front- end interfaces to deliver meaningful digital experiences ",
                is_current: true,
                _id: "68d2a31a1c4dd38875bb037f"
            },
            {
                company: "Example Technologies.",
                position: "Full Stack Developer",
                start_date: "2019-08",
                end_date: "2023-05",
                description: "Engineered and deployed scalable full-stack web applications for Example Technologies, translating complex requirements into robust front-end interfaces and efficient back-end services.",
                is_current: false,
                _id: "68d4f7abc8f0d46dc8a8b114"
            }
        ],
        education: [
            {
                institution: "Example Institute of Technology",
                degree: "B.TECH",
                field: "CSE",
                graduation_date: "2023-05",
                gpa: "8.7",
                _id: "68d2a31a1c4dd38875bb0380"
            },
            {
                institution: "Example Public School",
                degree: "HIGHER SECONDARY",
                field: "PCM",
                graduation_date: "2019-03",
                gpa: "",
                _id: "68d2a31a1c4dd38875bb0381"
            },
            {
                institution: "Example Academy",
                degree: "SECONDARY SCHOOL",
                field: "",
                graduation_date: "2017-03",
                gpa: "",
                _id: "68d2a31a1c4dd38875bb0382"
            }
        ],
        template: "minimal-image",
        accent_color: "#14B8A6",
        project: [
            {
                name: "Team Task Management System",
                type: "Web Application (Productivity Tool)",
                description: "TaskTrackr is a collaborative task management system designed for teams to create, assign, track, and manage tasks in real time. ",
                _id: "68d4f882c8f0d46dc8a8b139"
            },
            {
                name: "EduHub - Online Learning Platform",
                type: "Web Application (EdTech Platform)",
                description: "EduHub is an online learning platform where instructors can create courses with video lessons, quizzes, and downloadable resources.",
                _id: "68d4f89dc8f0d46dc8a8b147"
            }
        ],
        updatedAt: "2025-09-23T13:39:38.395Z",
        createdAt: "2025-09-23T13:39:38.395Z"
    };
    // const templates = [
    //     {
    //         id: 1,
    //         name: "Classic",
    //         component: <ClassicTemplate data={dummyResumeData} accentColor={dummyResumeData.accent_color} />,
    //     },
    //     {
    //         id: 2,
    //         name: "Modern",
    //         component: <ModernTemplate data={dummyResumeData} accentColor={dummyResumeData.accent_color} />,
    //     },
    //     {
    //         id: 3,
    //         name: "Minimal",
    //         component: <MinimalTemplate data={dummyResumeData} accentColor={dummyResumeData.accent_color} />,
    //     },
    //     {
    //         id: 4,
    //         name: "Minimal with Image",
    //         component: <MinimalImageTemplate data={dummyResumeData} />,
    //     }
    // ];
    const templates = [
        { id: 1, name: "Classic", image: classic },
        { id: 2, name: "Modern", image: modern },
        { id: 3, name: "Minimal", image: minimal },
        { id: 4, name: "Minimal with Image", image: minimalImage },

    ];
    const [selected, setSelected] = useState(null);



    return (
        <section className="py-14 bg-white px-4">
            <div className="max-w-6xl mx-auto">

                {/* Heading */}
                <div id='testimonials' className='flex flex-col items-center my-10 scroll-mt-12'>
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-400/10 rounded-full px-6 py-1.5">
                        <LuLayers className='size-4.5 stroke-green-600' />
                        <span>Preview</span>
                    </div>
                    <Title title="More Professional" desciption='Professionally tested resume templates designed for recruiter success. Download in PDF with ATS-optimized layouts.' />
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-4 gap-8">
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            className="border border-gray-200 rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
                            onClick={() => setSelected(template)}>
                            <div className="h-[300px] overflow-hidden flex justify-center bg-gray-100">
                                <div className="w-[1000px] origin-top">
                                    <img src={template.image} alt={template.name} />
                                </div>
                            </div>

                            <div className="text-center p-3 font-medium">
                                {template.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 🔥 Modal */}
            {selected && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

                    <div className="relative bg-white rounded-xl max-w-4xl w-full p-4">

                        {/* Close Button */}
                        <button
                            onClick={() => setSelected(null)}
                            className="absolute top-3 right-3 text-gray-600 hover:text-black"
                        >
                            <FaTimes size={18} />
                        </button>

                        {/* Image Preview */}
                        {/* <img
                            src={selected.image}
                            alt={selected.name}
                            className="w-full max-h-[80vh] object-contain rounded"
                        /> */}
                        <div className="w-full h-[80vh] overflow-auto flex justify-center">
                            <img src={selected.image} alt={selected.name} className="w-full max-h-[80vh] object-contain rounded" />

                        </div>

                        {/* Actions */}
                        {/* <div className="flex justify-between items-center mt-4 px-2">
                            <h3 className="font-semibold text-lg">{selected.name}</h3>

                            <button
                                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                                onClick={() => {
                                    // 👉 navigate to editor with template
                                    console.log("Use template:", selected.name);
                                }}
                            >
                                Use Template
                            </button>
                        </div> */}

                    </div>
                </div>
            )}
        </section>
    );
}
