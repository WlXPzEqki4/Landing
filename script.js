// async function loadProjectNotes() {
//     try {
//         const response = await fetch('project-notes.csv');
//         const text = await response.text();
//         return new Promise((resolve) => {
//             Papa.parse(text, {
//                 delimiter: ',',
//                 header: true,
//                 complete: (results) => {
//                     const projectNotes = {};
//                     results.data.forEach(row => {
//                         if (!projectNotes[row.projectId]) {
//                             projectNotes[row.projectId] = { sections: {} };
//                         }
//                         if (!projectNotes[row.projectId].sections[row.sectionName]) {
//                             projectNotes[row.projectId].sections[row.sectionName] = [];
//                         }
//                         projectNotes[row.projectId].sections[row.sectionName].push({
//                             content: row.content,
//                             order: parseInt(row.order),
//                             suborder: parseInt(row.suborder)
//                         });
//                     });
 
//                     Object.values(projectNotes).forEach(project => {
//                         Object.values(project.sections).forEach(section => {
//                             section.sort((a, b) => {
//                                 if (a.order !== b.order) return a.order - b.order;
//                                 return a.suborder - b.suborder;
//                             });
//                         });
//                     });
//                     resolve(projectNotes);
//                 },
//                 error: (error) => {
//                     console.error('Parse error:', error);
//                     resolve({});
//                 }
//             });
//         });
//     } catch (error) {
//         console.error('File read error:', error);
//         return {};
//     }
//  }


//  function formatContentToHTML(points) {
//     let html = '<ul>';
//     let currentOrder = -1;
//     let subList = '';
 
//     points.forEach(point => {
//         if (point.suborder === 0) {
//             if (subList) {
//                 html += subList + '</li>';
//                 subList = '';
//             }
//             if (currentOrder !== point.order) {
//                 html += `<li>${point.content}`;
//                 currentOrder = point.order;
//             }
//         } else {
//             if (subList === '') subList = '<ul>';
//             subList += `<li>${point.content}</li>`;
//         }
//     });
 
//     if (subList) html += subList + '</ul></li>';
//     html += '</ul>';
//     return html;
//  }
 
//  function createNotesPanel(sections) {
//     let sectionsHTML = '';
//     Object.entries(sections).forEach(([sectionName, content]) => {
//         const sectionId = `notes-${sectionName.toLowerCase().replace(/\s+/g, '-')}`;
//         sectionsHTML += `
//             <h3>${sectionName}</h3>
//             <div id="${sectionId}"></div>
//         `;
//     });
 
//     document.body.insertAdjacentHTML('beforeend', `
//         <div class="notes-panel">
//             <div class="close-notes" onclick="toggleNotes()">×</div>
//             <h2>Project Notes</h2>
//             <div class="notes-content">
//                 ${sectionsHTML}
//             </div>
//         </div>
//     `);
//  }

// window.toggleNotes = async function(projectName) {
//     let panel = document.querySelector('.notes-panel');
    
//     if (projectName) {
//         const projectNotes = await loadProjectNotes();
//         const projectNote = projectNotes[projectName];
        
//         if (projectNote) {
//             let sectionsHTML = '';
//             let markdownContent = `# ${projectName}\n\n`; // Build markdown as we go
            
//             Object.entries(projectNote.sections).forEach(([sectionName, points]) => {
//                 const sectionId = `notes-${sectionName.toLowerCase().replace(/\s+/g, '-')}`;
//                 sectionsHTML += `
//                     <h3>${sectionName}</h3>
//                     <div id="${sectionId}">${formatContentToHTML(points)}</div>
//                 `;
                
//                 // Add to markdown content
//                 markdownContent += `## ${sectionName}\n${formatContentToMarkdown(points)}\n\n`;
//             });
            
//             // Add download buttons
//             sectionsHTML += `
//                 <div class="download-buttons">
//                     <button onclick="downloadContent('${encodeURIComponent(markdownContent)}', '${projectName.toLowerCase().replace(/\s+/g, '-')}.md')">MD</button>
//                     <button onclick="downloadContent('${encodeURIComponent(markdownContent)}', '${projectName.toLowerCase().replace(/\s+/g, '-')}.txt')">TXT</button>
//                     <button onclick="downloadPDF('${encodeURIComponent(markdownContent)}', '${projectName.toLowerCase().replace(/\s+/g, '-')}.pdf')">PDF</button>
//                     <button onclick="downloadDOCX('${encodeURIComponent(markdownContent)}', '${projectName.toLowerCase().replace(/\s+/g, '-')}.docx')">DOCX</button>
//                 </div>
//             `;
            
//             panel.querySelector('.notes-content').innerHTML = sectionsHTML;
//             panel.querySelector('h2').textContent = `${projectName} - Notes`;
//         }
//         panel.classList.add('active');
//     } else {
//         panel.classList.remove('active');
//     }
// }





// function formatContentToMarkdown(points) {
//     let markdown = '';
//     let currentOrder = -1;
    
//     points.forEach(point => {
//         const indent = '  '.repeat(point.suborder);
//         markdown += `${indent}* ${point.content}\n`;
//     });
    
//     return markdown;
// }


// window.downloadContent = function(content, filename) {
//     console.log('Downloading:', content, filename);
//     const decodedContent = decodeURIComponent(content);
//     const blob = new Blob([decodedContent], { type: 'text/plain;charset=utf-8' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     document.body.appendChild(a);
//     a.style.display = 'none';
//     a.href = url;
//     a.download = filename;
//     a.click();
//     window.URL.revokeObjectURL(url);
//     document.body.removeChild(a);
// }



// window.downloadPDF = function(content, filename) {
//     const { jsPDF } = window.jspdf;
//     const doc = new jsPDF();
//     doc.text(decodeURIComponent(content), 10, 10);
//     doc.save(filename);
// }

// window.downloadDOCX = function(content, filename) {
//     console.log('DOCX download triggered', { content, filename });
//     try {
//         const doc = new docx.Document({
//             sections: [{
//                 properties: {},
//                 children: [
//                     new docx.Paragraph({
//                         children: [new docx.TextRun(decodeURIComponent(content))]
//                     })
//                 ]
//             }]
//         });

//         docx.Packer.toBlob(doc).then(blob => {
//             const url = window.URL.createObjectURL(blob);
//             const a = document.createElement('a');
//             document.body.appendChild(a);
//             a.href = url;
//             a.download = filename;
//             a.click();
//             window.URL.revokeObjectURL(url);
//         });
//     } catch (error) {
//         console.error('DOCX error:', error);
//     }
// }



//  document.addEventListener('DOMContentLoaded', function() {
//     const projects = [
//         {
//             name: "Streamlit MAID app",
//             link: "https://appmaid-8xrg9enup77yzggvzzm9kj.streamlit.app/",
//             image: "images/project1.png",
//             description: "A brief description of project 1 and its purpose.",
//             tags: ["React", "Frontend", "API"],
//             icons: ["react", "js", "api"],
//             githubRepo: "https://github.com/WlXPzEqki4/DI2025",
//             githubClone: "https://github.com/WlXPzEqki4/DI2025.git",
//             hostedLink: "https://di-2025.vercel.app/"
//         },
//         {
//             name: "MALL 2 - ScrollyTelling",
//             link: "https://mall-scrollytelling.vercel.app/",
//             image: "images/project2.png",
//             description: "Description for project 2, explaining the functionality.",
//             tags: ["Node.js", "Backend", "Database"],
//             icons: ["nodejs","database"],
//             githubRepo: "https://github.com/WlXPzEqki4/DI2025",
//             githubClone: "https://github.com/WlXPzEqki4/DI2025.git",
//             hostedLink: "https://di-2025.vercel.app/"
//         },
//         {
//             name: "WILDCARDS - Most Dangerous Ideas 2025",
//             link: "https://di-2025.vercel.app/",
//             image: "images/project3.png",
//             description: "More information about what project 3 achieves.",
//             tags: ["Vue.js", "Fullstack", "UI"],
//             icons: ["vuejs", "js","html","css"],
//             githubRepo: "https://github.com/WlXPzEqki4/DI2025",
//             githubClone: "https://github.com/WlXPzEqki4/DI2025.git",
//             hostedLink: "https://di-2025.vercel.app/"
//         },
//         {
//             name: "WIP WILDCARDS - Most Dangerous Ideas 2025",
//             link: "https://di-2025-wip.vercel.app/",
//             image: "images/project4.png",
//             description: "More information about what project 4 achieves.",
//             tags: ["Python", "ML", "AI"],
//             icons: ["python", "ml"],
//             githubRepo: "https://github.com/WlXPzEqki4/DI2025",
//             githubClone: "https://github.com/WlXPzEqki4/DI2025.git",
//             hostedLink: "https://di-2025.vercel.app/"
//         },
//         {
//             name: "Narrative Analysis",
//             link: "https://narrative-six.vercel.app/",
//             image: "images/project5.png",
//             description: "More information about what project 5 achieves.",
//             tags: ["Typescript", "UI", "UX"],
//             icons: ["typescript","html","css"],
//             githubRepo: "https://github.com/WlXPzEqki4/DI2025",
//             githubClone: "https://github.com/WlXPzEqki4/DI2025.git",
//             hostedLink: "https://di-2025.vercel.app/"
//         },
//         {
//             name: "Daily Route",
//             link: "https://daily-route-viz.vercel.app/",
//             image: "images/project6.png",
//             description: "More information about what project 6 achieves.",
//             tags: ["NextJS", "Frontend", "Backend"],
//             icons: ["nextjs","js"],
//             githubRepo: "https://github.com/WlXPzEqki4/DI2025",
//             githubClone: "https://github.com/WlXPzEqki4/DI2025.git",
//             hostedLink: "https://di-2025.vercel.app/"
//         },
//         {
//             name: "Pattern of Life",
//             link: "https://pattern-of-life-viz.vercel.app/",
//             image: "images/project7.png",
//             description: "More information about what project 6 achieves.",
//             tags: ["NextJS", "Frontend", "Backend"],
//             icons: ["nextjs","js"],
//             githubRepo: "https://github.com/WlXPzEqki4/DI2025",
//             githubClone: "https://github.com/WlXPzEqki4/DI2025.git",
//             hostedLink: "https://di-2025.vercel.app/"
//         },
//     ];
 
//     const projectList = document.querySelector('.project-list');
 
//     projects.forEach(project => {
//         const projectItem = document.createElement('div');
//         projectItem.classList.add('project-item');
 
//         projectItem.innerHTML = `
//             <img src="${project.image}" alt="${project.name} Screenshot">
//             <div class="project-content">
//                 <h3>${project.name}</h3>
//                 <p>${project.description}</p>
//                 <div class="tags">
//                     ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
//                 </div>
//                 <div class="icon-list">
//                     ${project.icons.map(icon => getIconHTML(icon)).join('')}
//                 </div>
//                 <div class="link-list">
//                     <b>Github Repo:</b> <a href="${project.githubRepo}" target="_blank">${project.githubRepo}</a>
//                     <br>
//                     <b>Github Clone:</b> <a href="${project.githubClone}" target="_blank">${project.githubClone}</a>
//                     <br>
//                     <b>Hosted Link:</b> <a href="${project.hostedLink}" target="_blank">${project.hostedLink}</a>
//                 </div>
//                 <button class="notes-button" onclick="toggleNotes('${project.name}')">Notes</button>
//             </div>
//             <a href="${project.link}" target="_blank" class="view-project-btn">View Project</a>
//         `;
//         projectList.appendChild(projectItem);
//     });
//  });
 
//  // Keep existing getIconHTML function
//  function getIconHTML(icon) {
//     const iconMap = {
//         html: { icon: "fab fa-html5", label: "HTML5" },
//         css: { icon: "fab fa-css3-alt", label: "CSS3" },
//         js: { icon: "fab fa-js-square", label: "JavaScript" },
//         python: { icon: "fab fa-python", label: "Python" },
//         react: { icon: "fab fa-react", label: "React" },
//         nodejs: { icon: "fab fa-node-js", label: "Node.js" },
//         database: { icon: "fas fa-database", label: "Database" },
//         vuejs: { icon: "fab fa-vuejs", label: "Vue.js" },
//         typescript: {icon: "fab fa-microsoft", label: "Typescript"},
//         ml: { icon: "fas fa-brain", label: "Machine Learning" },
//         api: {icon: "fas fa-code-branch", label: "API"},
//         nextjs: {icon: "fab fa-node-js", label: "Next.js"},
//     };
 
//     const iconInfo = iconMap[icon];
 
//     return iconInfo ? `
//         <div class="icon-item" title="${iconInfo.label}">
//             <i class="${iconInfo.icon}"></i>
//         </div>
//     ` : "";
//  }
 
//  function toggleNav() {
//     const sidebar = document.querySelector('.sidebar');
//     sidebar.classList.toggle('collapsed');
//  }

















 async function loadProjectNotes() {
    try {
        const response = await fetch('project-notes.csv');
        const text = await response.text();
        return new Promise((resolve) => {
            Papa.parse(text, {
                delimiter: ',',
                header: true,
                complete: (results) => {
                    const projectNotes = {};
                    results.data.forEach(row => {
                        if (!projectNotes[row.projectId]) {
                            projectNotes[row.projectId] = { sections: {} };
                        }
                        if (!projectNotes[row.projectId].sections[row.sectionName]) {
                            projectNotes[row.projectId].sections[row.sectionName] = [];
                        }
                        projectNotes[row.projectId].sections[row.sectionName].push({
                            content: row.content,
                            order: parseInt(row.order),
                            suborder: parseInt(row.suborder)
                        });
                    });
 
                    Object.values(projectNotes).forEach(project => {
                        Object.values(project.sections).forEach(section => {
                            section.sort((a, b) => {
                                if (a.order !== b.order) return a.order - b.order;
                                return a.suborder - b.suborder;
                            });
                        });
                    });
                    resolve(projectNotes);
                },
                error: (error) => {
                    console.error('Parse error:', error);
                    resolve({});
                }
            });
        });
    } catch (error) {
        console.error('File read error:', error);
        return {};
    }
 }


 function formatContentToHTML(points) {
    let html = '<ul>';
    let currentOrder = -1;
    let subList = '';
 
    points.forEach(point => {
        if (point.suborder === 0) {
            if (subList) {
                html += subList + '</li>';
                subList = '';
            }
            if (currentOrder !== point.order) {
                html += `<li>${point.content}`;
                currentOrder = point.order;
            }
        } else {
            if (subList === '') subList = '<ul>';
            subList += `<li>${point.content}</li>`;
        }
    });
 
    if (subList) html += subList + '</ul></li>';
    html += '</ul>';
    return html;
 }
 

// First, make downloadCSV function globally available
window.downloadCSV = async function(filename) {
    try {
        const response = await fetch(`/data/${filename}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error('Error downloading CSV:', error);
        alert('Failed to download the CSV file. Please make sure the file exists.');
    }
};


window.toggleNotes = async function(projectName) {
    console.log("toggleNotes called with:", projectName);
    let panel = document.querySelector('.notes-panel');
    
    if (!panel) {
        console.error("Notes panel not found!");
        return;
    }
    
    if (!projectName) {
        panel.classList.remove('active');
        return;
    }
 
    try {
        if (!window.projects) {
            console.error("Projects array not found!");
            return;
        }
 
        const projectNotes = await loadProjectNotes();
        const projectNote = projectNotes[projectName];
        const project = window.projects.find(p => p.name === projectName);
        
        if (!project) {
            console.error("Project not found:", projectName);
            return;
        }
        
        if (projectNote) {
            let sectionsHTML = '';
            let markdownContent = `# ${projectName}\n\n`;
            
            // First add all the sections content
            Object.entries(projectNote.sections).forEach(([sectionName, points]) => {
                const sectionId = `notes-${sectionName.toLowerCase().replace(/\s+/g, '-')}`;
                sectionsHTML += `
                    <h3>${sectionName}</h3>
                    <div id="${sectionId}">${formatContentToHTML(points)}</div>
                `;
                
                markdownContent += `## ${sectionName}\n${formatContentToMarkdown(points)}\n\n`;
            });
            
            // Add the export section with divider
            sectionsHTML += `
                <div class="export-section">
                    <h3><i class="fas fa-download"></i> Export Options</h3>
                    <div class="export-options">
                        <button class="export-button" onclick="downloadContent('${encodeURIComponent(markdownContent)}', '${projectName.toLowerCase().replace(/\s+/g, '-')}.md')">
                            <i class="fas fa-file-code"></i> MD
                        </button>
                        <button class="export-button" onclick="downloadContent('${encodeURIComponent(markdownContent)}', '${projectName.toLowerCase().replace(/\s+/g, '-')}.txt')">
                            <i class="fas fa-file-lines"></i> TXT
                        </button>
                        <button class="export-button" onclick="downloadPDF('${encodeURIComponent(markdownContent)}', '${projectName.toLowerCase().replace(/\s+/g, '-')}.pdf')">
                            <i class="fas fa-file-pdf"></i> PDF
                        </button>
                        <button class="export-button" onclick="downloadDOCX('${encodeURIComponent(markdownContent)}', '${projectName.toLowerCase().replace(/\s+/g, '-')}.docx')">
                            <i class="fas fa-file-word"></i> DOCX
                        </button>
                    </div>
                </div>
            `;
 
            // Add Technical Documentation section if the project has a technical doc
            if (project && project.technicalDoc) {
                sectionsHTML += `
                    <div class="export-section">
                        <h3><i class="fas fa-book"></i> Technical Documentation</h3>
                        <div class="export-options">
                            <button class="export-button" onclick="downloadTechnicalDoc('${project.technicalDoc}')">
                                <i class="fas fa-file-word"></i> Documentation
                            </button>
                        </div>
                    </div>
                `;
            }




            // Inside your toggleNotes function, after the technical documentation section:
            // if (project && project.screenshotImage) {
            //     sectionsHTML += `
            //         <div class="export-section">
            //             <h3><i class="fas fa-camera"></i> Screenshots</h3>
            //             <div class="screenshot-container">
            //                 <img src="${project.screenshotImage}" alt="Project Screenshot" class="notes-screenshot">
            //             </div>
            //         </div>
            //     `;
            // }



            // Inside your toggleNotes function
            if (project && project.screenshots && project.screenshots.length > 0) {
                sectionsHTML += `
                    <div class="export-section">
                        <h3><i class="fas fa-camera"></i> Screenshots</h3>
                        <div class="screenshot-container">
                            ${project.screenshots.map(screenshot => `
                                <img src="${screenshot}" alt="Project Screenshot" class="notes-screenshot">
                            `).join('')}
                        </div>
                    </div>
                `;
            }







            
            panel.querySelector('.notes-content').innerHTML = sectionsHTML;
            panel.querySelector('h2').textContent = `${projectName} - Notes`;
            panel.classList.add('active');
        }
    } catch (error) {
        console.error('Error loading notes:', error);
    }
 }


// Add this new function for downloading technical documentation
window.downloadTechnicalDoc = async function(filename) {
    try {
        const response = await fetch(filename);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename.split('/').pop();
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error('Error downloading technical documentation:', error);
        alert('Failed to download technical documentation. Please try again.');
    }
};

function formatContentToMarkdown(points) {
    let markdown = '';
    let currentOrder = -1;
    
    points.forEach(point => {
        const indent = '  '.repeat(point.suborder);
        markdown += `${indent}* ${point.content}\n`;
    });
    
    return markdown;
}


window.downloadContent = function(content, filename) {
    console.log('Downloading:', content, filename);
    const decodedContent = decodeURIComponent(content);
    const blob = new Blob([decodedContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}



window.downloadPDF = function(content, filename) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text(decodeURIComponent(content), 10, 10);
    doc.save(filename);
}

window.downloadDOCX = function(content, filename) {
    console.log('DOCX download triggered', { content, filename });
    try {
        const doc = new docx.Document({
            sections: [{
                properties: {},
                children: [
                    new docx.Paragraph({
                        children: [new docx.TextRun(decodeURIComponent(content))]
                    })
                ]
            }]
        });

        docx.Packer.toBlob(doc).then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
        });
    } catch (error) {
        console.error('DOCX error:', error);
    }
}



 document.addEventListener('DOMContentLoaded', function() {
    window.projects = [
        {
            name: "Streamlit MAID app",
            link: "https://appmaid-8xrg9enup77yzggvzzm9kj.streamlit.app/",
            image: "images/project1.png",
            description: "An advanced intelligence analysis platform that transforms Mobile Advertising ID data into comprehensive network and behavioural insights, enabling deep pattern recognition and relationship mapping for intelligence operations.",
            tags: ["React", "Frontend", "API"],
            icons: ["react", "js", "api"],
            githubRepo: "https://github.com/WlXPzEqki4/streamlit_maid",
            githubClone: "https://github.com/WlXPzEqki4/streamlit_maid.git",
            hostedLink: "https://appmaid-8xrg9enup77yzggvzzm9kj.streamlit.app/",
            projectLink: "https://share.streamlit.io/user/WlXPzEqki4",
            csvDownload: "maid_data.csv",
            technicalDoc: "notes/20250112_MAID Streamlit.docx",
            screenshots: [
                "images/MAID1.png",
                "images/MAID2.png",
                "images/MAID3.png",
                "images/MAID4.png",
                "images/MAID5.png",
                "images/MAID6.png",
                "images/MAID7.png",
                "images/MAID8.png",
                "images/MAID9.png",
                "images/MAID10.png",
                "images/MAID11.png",
                "images/MAID12.png",
                "images/MAID13.png",
                "images/MAID14.png",
                "images/MAID15.png",
                "images/MAID16.png",
                "images/MAID17.png",
                "images/MAID18.png",
                "images/MAID19.png",
                "images/MAID20.png",
                "images/MAID21.png",
                "images/MAID22.png"
            ]
        },
        {
            name: "MALL 2 - ScrollyTelling",
            link: "https://mall-scrollytelling.vercel.app/",
            image: "images/project2.png",
            description: "An interactive intelligence reporting platform that transforms static OSINT data into dynamic visualisations, integrating geospatial analysis, network mapping, and multimedia elements to track Subjects of Interest (SOIs) and their activities.",
            tags: ["Node.js", "Backend", "Database"],
            icons: ["nodejs","database"],
            githubRepo: "",
            githubClone: "",
            hostedLink: "https://mall-scrollytelling.vercel.app/",
            projectLink: "https://vercel.com/wlxpzeqki4s-projects/mall-scrollytelling",
            technicalDoc: "notes/20250112_MALL Scrollytelling.docx",
            screenshots: [
                "images/MALL.png"
            ]
        },
        {
            name: "WILDCARDS - Most Dangerous Ideas 2025",
            link: "https://di-2025.vercel.app/",
            image: "images/project3.png",
            description: "A comprehensive analysis of emerging threats and opportunities that could reshape the strategiv landscape of the UAE in 2025.",
            tags: ["Vue.js", "Fullstack", "UI"],
            icons: ["vuejs", "js","html","css"],
            githubRepo: "https://github.com/WlXPzEqki4/DI2025",
            githubClone: "https://github.com/WlXPzEqki4/DI2025.git",
            hostedLink: "https://di-2025.vercel.app/",
            projectLink: "https://vercel.com/wlxpzeqki4s-projects/di-2025",
            screenshots: [
                "images/DI2025.png",
                "images/DI2025_Power.png",
                "images/DI2025_Tech.png",
                "images/DI2025_SecInfra.png",
                "images/DI2025_EcoEnv.png",
                "images/DI2025_Comp1.png",
                "images/DI2025_Comp2.png",
                "images/DI2025_Comp3.png"
            ]
        },
        {
            name: "WIP WILDCARDS - Most Dangerous Ideas 2025",
            link: "https://di-2025-wip.vercel.app/",
            image: "images/project4.png",
            description: "A Work In Progress visualisation application, for the Wildcards / Most Dangerous Ideas 2025 project.",
            tags: ["Python", "ML", "AI"],
            icons: ["python", "ml"],
            githubRepo: "https://github.com/WlXPzEqki4/DI2025WIP",
            githubClone: "https://github.com/WlXPzEqki4/DI2025WIP.git",
            hostedLink: "https://di-2025-wip.vercel.app/",
            projectLink: "https://vercel.com/wlxpzeqki4s-projects/di-2025-wip",
            screenshots: [
                "images/DI2025WIP.png"
            ]
        },
        {
            name: "Narrative Analysis",
            link: "https://narrative-six.vercel.app/",
            image: "images/project5.png",
            description: "An advanced analytical platform that transforms large article datasets into intelligence-grade narrative insights, enabling detection of thematic patterns, relationships, and temporal evolution through multi-dimensional visualisation.",
            tags: ["Typescript", "UI", "UX"],
            icons: ["typescript","html","css"],
            githubRepo: "https://github.com/WlXPzEqki4/narrative",
            githubClone: "https://github.com/WlXPzEqki4/narrative.git",
            hostedLink: "https://narrative-six.vercel.app/",
            projectLink: "https://vercel.com/wlxpzeqki4s-projects/narrative",
            technicalDoc: "notes/20250112_Narrative Analysis.docx",
            screenshots: [
                "images/Narrative.png"
            ]
        },
        {
            name: "Daily Route",
            link: "https://daily-route-viz.vercel.app/",
            image: "images/project6.png",
            description: "A sophisticated intelligence visualisation tool that transforms Mobile Advertising ID data into interactive spatiotemporal visualisations, enabling detailed analysis of movement patterns and behavioural trends.",
            tags: ["NextJS", "Frontend", "Backend"],
            icons: ["nextjs","js"],
            githubRepo: "https://github.com/WlXPzEqki4/daily-route-viz",
            githubClone: "https://github.com/WlXPzEqki4/daily-route-viz.git",
            hostedLink: "https://daily-route-viz.vercel.app/",
            projectLink: "https://github.com/WlXPzEqki4/daily-route-viz",
            technicalDoc: "notes/20250112_MAID Daily Route.docx",
            screenshots: [
                "images/DailyRoute.png"
            ]
        },
        {
            name: "Pattern of Life",
            link: "https://pattern-of-life-viz.vercel.app/",
            image: "images/project7.png",
            description: "A sophisticated intelligence platform that analyses Mobile Advertising ID (MAID) data to uncover behavioural patterns, routines, and anomalies through multi-layered temporal and spatial analysis.",
            tags: ["NextJS", "Frontend", "Backend"],
            icons: ["nextjs","js"],
            githubRepo: "https://github.com/WlXPzEqki4/pattern-of-life-viz",
            githubClone: "https://github.com/WlXPzEqki4/pattern-of-life-viz.git",
            hostedLink: "https://pattern-of-life-viz.vercel.app/",
            projectLink: "https://vercel.com/wlxpzeqki4s-projects/pattern-of-life-viz",
            technicalDoc: "notes/20250112_Pattern of Life Analysis.docx",
            screenshots: [
                "images/PatternofLife.png"
            ]
        },
    ];
 
    const projectList = document.querySelector('.project-list');
 
    projects.forEach(project => {
        const projectItem = document.createElement('div');
        projectItem.classList.add('project-item');
 

        // Modified project item HTML to include CSV download button for Streamlit MAID app
        const csvDownloadButton = project.csvDownload ? 
            `<button class="download-csv-button" onclick="downloadCSV('${project.csvDownload}')">
                <i class="fas fa-download"></i> Download Dataset
            </button>` : '';

        projectItem.innerHTML = `
        <img src="${project.image}" alt="${project.name} Screenshot">
        <div class="project-content">
            <h3>${project.name}</h3>
            <p>${project.description}</p>
            <div class="tags">
                ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
            </div>
            <div class="icon-list">
                ${project.icons.map(icon => getIconHTML(icon)).join('')}
            </div>
            <div class="link-list">
                <b>Github Repo:</b> <a href="${project.githubRepo}" target="_blank">${project.githubRepo}</a>
                <br>
                <b>Github Clone:</b> <a href="${project.githubClone}" target="_blank">${project.githubClone}</a>
                <br>
                <b>Hosted Link:</b> <a href="${project.hostedLink}" target="_blank">${project.hostedLink}</a>
                <br>
                <b>Project Link:</b> <a href="${project.projectLink}" target="_blank">${project.projectLink}</a>
            </div>
            <div class="button-group">
                ${project.name === "Streamlit MAID app" ? 
                    `<button class="download-csv-button" onclick="downloadCSV('maid_data.csv')">
                        <i class="fas fa-download"></i> Download Dataset
                    </button>` : ''
                }
                <button class="notes-button" onclick="toggleNotes('${project.name}')">Notes</button>
            </div>
        </div>
        <a href="${project.link}" target="_blank" class="view-project-btn">View Project</a>
    `;

        projectList.appendChild(projectItem);
    });
 });
 
 // Keep existing getIconHTML function
 function getIconHTML(icon) {
    const iconMap = {
        html: { icon: "fab fa-html5", label: "HTML5" },
        css: { icon: "fab fa-css3-alt", label: "CSS3" },
        js: { icon: "fab fa-js-square", label: "JavaScript" },
        python: { icon: "fab fa-python", label: "Python" },
        react: { icon: "fab fa-react", label: "React" },
        nodejs: { icon: "fab fa-node-js", label: "Node.js" },
        database: { icon: "fas fa-database", label: "Database" },
        vuejs: { icon: "fab fa-vuejs", label: "Vue.js" },
        typescript: {icon: "fab fa-microsoft", label: "Typescript"},
        ml: { icon: "fas fa-brain", label: "Machine Learning" },
        api: {icon: "fas fa-code-branch", label: "API"},
        nextjs: {icon: "fab fa-node-js", label: "Next.js"},
    };
 
    const iconInfo = iconMap[icon];
 
    return iconInfo ? `
        <div class="icon-item" title="${iconInfo.label}">
            <i class="${iconInfo.icon}"></i>
        </div>
    ` : "";
 }
 
 function toggleNav() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('collapsed');
 }



















