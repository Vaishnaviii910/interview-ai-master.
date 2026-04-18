import React from 'react';
import "../style/home.scss";

const Home = () => {
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
                    {/* Left Card: Target Job Description */}
                    <div className="card left-card">
                        <div className="card-header">
                            <span className="icon">💼</span>
                            <span className="card-title">Target Job Description</span>
                            <span className="pill pill-required">REQUIRED</span>
                        </div>
                        <textarea
                            name="jobDescription"
                            id="jobDescription"
                            className="job-textarea"
                            placeholder={
                                "Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"
                            }
                            maxLength={5000}
                        />
                        <div className="char-count">0 / 5000 chars</div>
                        <div className="ai-info">AI-Powered Strategy Generation • Approx 30s</div>
                    </div>
                    {/* Right Card: Your Profile */}
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
                            <div className="upload-icon"> <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e052d1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg> </div>
                            Click to upload or drag & drop
                            <div className="upload-desc">PDF or DOCX (Max 5MB)</div>
                        </label>
                        <input hidden type="file" name="resume" id="resume" accept=".pdf,.doc,.docx" />
                        <div className="or-divider">OR</div>
                        <div className="self-desc-group">
                            <label htmlFor="selfDescription" className="self-desc-label">Quick Self-Description</label>
                            <textarea
                                name="selfDescription"
                                id="selfDescription"
                                className="self-desc-textarea"
                                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                            />
                        </div>
                        <div className="info-bar">
                            <span className="info-icon">ℹ️</span>
                            <span>Either a <b>Resume</b> or a <b>Self Description</b> is required to generate a personalized plan.</span>
                        </div>
                        <button className="button primary-button generate-btn">
                            <span>★ Generate My Interview Strategy</span>
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home;