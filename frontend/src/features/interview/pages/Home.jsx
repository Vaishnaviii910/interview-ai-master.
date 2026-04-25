import React,{useState,useRef} from 'react';
import "../style/home.scss";
import { useInterview } from '../hooks/useInterview';
import {useNavigate} from 'react-router'

const Home = () => {

    const {loading, generateReport,reports } = useInterview()
    const [jobDescription,setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [selectedFile, setSelectedFile] = useState(null) // ✅ added

    const resumeInputRef = useRef() 

    const navigate = useNavigate()

    const handleGenerateReport = async ()=>{
        const resumeFile = resumeInputRef.current.files[0]
        const data = await generateReport({jobDescription,selfDescription,resumeFile})
        navigate(`/interview/${data._id}`)
    }

    if(loading){
        return (
            <main className='loading-screen'>
                <h1>Loading your interview plan.....</h1>
            </main>
        )
    }
    return (
        <main className="home">
            <section className="home-section">
                <h1 className="home-title">
                    Create Your Custom <span className="gradient-text">Interview Plan</span>
                </h1>
                <p className="home-subtitle">
                    Let our AI analyze the job requirements and your unique profile to build a winning strategy.
                </p>
                <div className="interview-input-group">
                    
                    {/* Left Card */}
                    <div className="card left-card">
                        <div className="card-header">
                            <span className="icon">💼</span>
                            <span className="card-title">Target Job Description</span>
                            <span className="pill pill-required">REQUIRED</span>
                        </div>

                        <textarea
                            onChange={(e)=>{setJobDescription(e.target.value)}}
                            className="job-textarea"
                            placeholder="Paste the full job description here..."
                        />

                        <div className="char-count">0 / 5000 chars</div>
                        <div className="ai-info">AI-Powered Strategy Generation • Approx 30s</div>
                    </div>

                    {/* Right Card */}
                    <div className="card right-card">
                        <div className="card-header">
                            <span className="icon">👤</span>
                            <span className="card-title">Your Profile</span>
                        </div>

                        <div className="upload-header">
                            <span className="upload-title">Upload Resume</span>
                            <span className="pill pill-best">BEST RESULTS</span>
                        </div>

                        <label htmlFor="resume" className="upload-label">
                            <div className="upload-icon">⬆️</div>
                            Click to upload or drag & drop
                            <div className="upload-desc">PDF or DOCX (Max 5MB)</div>
                        </label>

                        <input 
                            ref={resumeInputRef} 
                            hidden 
                            type="file" 
                            name="resume" 
                            id="resume" 
                            accept=".pdf,.doc,.docx"
                            onChange={(e)=>{
                                const file = e.target.files[0]
                                setSelectedFile(file) // ✅ added
                            }}
                        />

                        {/* ✅ FILE PREVIEW */}
                        {selectedFile && (
                            <div className="file-preview">
                                📄 {selectedFile.name}
                            </div>
                        )}

                        <div className="or-divider">And</div>

                        <div className="self-desc-group">
                            <label className="self-desc-label">Quick Self-Description</label>
                            <textarea
                                onChange={(e)=>{setSelfDescription(e.target.value)}}
                                className="self-desc-textarea"
                                placeholder="Briefly describe your experience..."
                            />
                        </div>

                        <div className="info-bar">
                            <span className="info-icon">ℹ️</span>
                            <span>Both <b>Resume</b> and <b>Self Description</b> is required.</span>
                        </div>

                        <button 
                            onClick={handleGenerateReport}
                            className="button primary-button generate-btn">
                            <span>★ Generate My Interview Strategy</span>
                        </button>
                    </div>
                </div>

                {/* REPORT LIST */}
                {reports.length > 0 && (
                    <section className='recent-reports'>

                        <h2>My Recent Interview Plans</h2>

                        <ul className='reports-list'>
                            {reports.map(report => (
                                <li 
                                    key={report._id} 
                                    className='report-item' 
                                    onClick={() => navigate(`/interview/${report._id}`)}
                                >
                                    <div className="report-header">
                                        <h3 className="report-title">
                                            {report.title || 'Untitled Position'}
                                        </h3>

                                        <span className={`score-badge ${
                                            report.matchScore >= 80 ? 'high' :
                                            report.matchScore >= 60 ? 'mid' : 'low'
                                        }`}>
                                            {report.matchScore}%
                                        </span>
                                    </div>

                                    <p className='report-meta'>
                                    📅 {new Date(report.createdAt).toLocaleDateString()}
                                    </p>
                                </li>
                            ))}
                        </ul>

                    </section>
                )}
            </section>
        </main>
    );
};

export default Home;