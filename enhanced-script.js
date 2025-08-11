// Enhanced EuroLynk Course Directory JavaScript
// Global variables
let coursesData = [];
let currentUser = null;
let userProgress = {};
let userFavorites = [];
let userRecommendations = [];

// Community posts data
let communityPosts = [
    {
        id: 1,
        author: "Sarah M.",
        category: "discussion",
        title: "Best CV optimization tips for tech jobs?",
        content: "I'm applying for software developer positions in Germany. Any specific tips for making my CV stand out in the tech industry?",
        date: "2024-01-15T10:30:00Z",
        likes: 12,
        comments: []
    },
    {
        id: 2,
        author: "Michael K.",
        category: "review",
        title: "Medical English course review",
        content: "Just completed the Medical English course. Excellent content and very practical for healthcare professionals. Highly recommend!",
        date: "2024-01-14T15:45:00Z",
        likes: 8,
        comments: []
    }
];

// DOM element references
let chatContainer, chatMessages, chatInput, chatToggle, sendButton;
let searchInput, countryFilter, categoryFilter, minPriceFilter, maxPriceFilter;
let durationFilter, formatFilter, ratingFilter, sortFilter;

// Navigation and tab management
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.style.display = 'none');
    
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected tab content
    const selectedContent = document.getElementById(tabName + 'Content');
    if (selectedContent) {
        selectedContent.style.display = 'block';
    }
    
    // Add active class to selected tab
    const selectedTab = document.querySelector(`[onclick="showTab('${tabName}')"]`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
}

function showTabContent(tabName) {
    showTab(tabName);
}

// AI Chat functionality
function toggleChat() {
    const chat = document.getElementById('aiChat');
    if (chat) {
        chat.classList.toggle('collapsed');
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
        addMessage('user', message);
        input.value = '';
        
        // Show loading indicator
        addMessage('ai', '🤔 Thinking...', true);
        
        // Process AI response
        setTimeout(() => {
            const response = processAIQuery(message);
            removeLoadingMessage();
            addMessage('ai', response);
        }, 1000);
    }
}

function addMessage(sender, message, isLoading = false) {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message ${isLoading ? 'loading' : ''}`;
    
    if (isLoading) {
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="loading-dots">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">
                ${sender === 'ai' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>'}
                <span>${message}</span>
            </div>
        `;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeLoadingMessage() {
    const loadingMessage = document.querySelector('.message.loading');
    if (loadingMessage) {
        loadingMessage.remove();
    }
}

// Enhanced AI Processing
function processAIQuery(query) {
    const lowerQuery = query.toLowerCase();
    
    // Check for specific query types
    if (lowerQuery.includes('recommend') || lowerQuery.includes('suggestion')) {
        return generatePersonalizedRecommendations();
    } else if (lowerQuery.includes('career') || lowerQuery.includes('path')) {
        return generateCareerPathResponse();
    } else if (lowerQuery.includes('compare') || lowerQuery.includes('vs')) {
        return generateComparisonResponse(query);
    } else if (lowerQuery.includes('price') || lowerQuery.includes('cost')) {
        return generatePriceResponse(query);
    } else if (lowerQuery.includes('country') || lowerQuery.includes('location')) {
        return generateCountryResponse(query);
    } else if (lowerQuery.includes('category') || lowerQuery.includes('type')) {
        return generateCategoryResponse(query);
    } else if (lowerQuery.includes('provider') || lowerQuery.includes('company')) {
        return generateProviderResponse(query);
    } else if (lowerQuery.includes('specific') || lowerQuery.includes('course')) {
        return generateSpecificCourseResponse(query);
    } else {
        return generateDefaultResponse(query);
    }
}

function generateAIResponse(query) {
    return processAIQuery(query);
}

function generatePersonalizedRecommendations() {
    const recommendations = coursesData
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);
    
    let response = '<strong>🎯 Personalized Recommendations:</strong><br><br>';
    
    recommendations.forEach((course, index) => {
        response += `${index + 1}. <strong>${course.title}</strong><br>`;
        response += `   📍 ${course.country} • 💰 €${course.startPrice}<br>`;
        response += `   ⭐ ${course.rating}/5 (${course.totalReviews} reviews)<br>`;
        response += `   🏢 ${course.provider.name}<br><br>`;
    });
    
    response += '<em>💡 These are based on high ratings and popularity. Want more specific recommendations? Tell me about your interests!</em>';
    return response;
}

function generateCareerPathResponse() {
    const careerPaths = {
        'CV': ['CV Optimization', 'Personal Branding', 'LinkedIn Profile', 'Cover Letter Writing'],
        'Interview': ['Interview Preparation', 'Communication Skills', 'Body Language', 'Salary Negotiation'],
        'Medical': ['Medical English', 'Patient Communication', 'Medical Documentation', 'Healthcare Ethics'],
        'Corporate': ['Leadership Skills', 'Project Management', 'Business Communication', 'Strategic Thinking'],
        'IT': ['Programming Fundamentals', 'Web Development', 'Data Analysis', 'Cybersecurity'],
        'Language': ['Business English', 'Conversational Skills', 'Grammar Mastery', 'Cultural Understanding']
    };
    
    let response = '<strong>🚀 Career Development Paths:</strong><br><br>';
    
    Object.entries(careerPaths).forEach(([category, skills]) => {
        response += `<strong>${category}:</strong><br>`;
        skills.forEach(skill => {
            response += `• ${skill}<br>`;
        });
        response += '<br>';
    });
    
    response += '<em>💡 Tip: Start with foundational skills and progressively build expertise!</em>';
    return response;
}

function generateComparisonResponse(query) {
    // Extract course names from query
    const courseNames = query.match(/(?:compare|vs)\s+(.+?)\s+(?:and|vs|with)\s+(.+)/i);
    
    if (courseNames) {
        const course1 = courseNames[1].trim();
        const course2 = courseNames[2].trim();
        
        const foundCourse1 = coursesData.find(c => 
            c.title.toLowerCase().includes(course1.toLowerCase())
        );
        const foundCourse2 = coursesData.find(c => 
            c.title.toLowerCase().includes(course2.toLowerCase())
        );
        
        if (foundCourse1 && foundCourse2) {
            return generateDetailedComparison(foundCourse1, foundCourse2);
        }
    }
    
    return 'I can help you compare courses! Try asking something like "Compare CV optimization vs interview preparation courses"';
}

function generateDetailedComparison(course1, course2) {
    let response = `<strong>📊 Course Comparison:</strong><br><br>`;
    
    response += `<strong>${course1.title}</strong><br>`;
    response += `📍 ${course1.country} • 💰 €${course1.startPrice}<br>`;
    response += `⭐ ${course1.rating}/5 • 📚 ${course1.duration}<br>`;
    response += `🏢 ${course1.provider.name}<br><br>`;
    
    response += `<strong>${course2.title}</strong><br>`;
    response += `📍 ${course2.country} • 💰 €${course2.startPrice}<br>`;
    response += `⭐ ${course2.rating}/5 • 📚 ${course2.duration}<br>`;
    response += `🏢 ${course2.provider.name}<br><br>`;
    
    // Price comparison
    if (course1.startPrice < course2.startPrice) {
        response += `💰 <strong>${course1.title}</strong> is €${course2.startPrice - course1.startPrice} cheaper<br>`;
    } else if (course2.startPrice < course1.startPrice) {
        response += `💰 <strong>${course2.title}</strong> is €${course1.startPrice - course2.startPrice} cheaper<br>`;
    } else {
        response += `💰 Both courses have the same price<br>`;
    }
    
    // Rating comparison
    if (course1.rating > course2.rating) {
        response += `⭐ <strong>${course1.title}</strong> has a higher rating<br>`;
    } else if (course2.rating > course1.rating) {
        response += `⭐ <strong>${course2.title}</strong> has a higher rating<br>`;
    } else {
        response += `⭐ Both courses have the same rating<br>`;
    }
    
    return response;
}

function generatePriceResponse(query) {
    const extractedCountry = extractCountry(query);
    const extractedCategory = extractCategory(query);
    
    let filteredCourses = coursesData;
    
    if (extractedCountry) {
        filteredCourses = filteredCourses.filter(course => 
            course.country.toLowerCase().includes(extractedCountry.toLowerCase())
        );
    }
    
    if (extractedCategory) {
        filteredCourses = filteredCourses.filter(course => 
            course.category.toLowerCase().includes(extractedCategory.toLowerCase())
        );
    }
    
    if (filteredCourses.length === 0) {
        return 'No courses found matching your criteria. Try being more specific about country or category.';
    }
    
    const sortedCourses = filteredCourses.sort((a, b) => a.startPrice - b.startPrice);
    const avgPrice = filteredCourses.reduce((sum, course) => sum + course.startPrice, 0) / filteredCourses.length;
    
    let response = `<strong>💰 Pricing Information:</strong><br><br>`;
    
    if (extractedCountry) response += `📍 <strong>Country:</strong> ${extractedCountry}<br>`;
    if (extractedCategory) response += `🏷️ <strong>Category:</strong> ${extractedCategory}<br>`;
    
    response += `📊 <strong>Average Price:</strong> €${Math.round(avgPrice)}<br>`;
    response += `💵 <strong>Price Range:</strong> €${sortedCourses[0].startPrice} - €${sortedCourses[sortedCourses.length - 1].startPrice}<br><br>`;
    
    response += `<strong>Top 3 Most Affordable:</strong><br>`;
    sortedCourses.slice(0, 3).forEach((course, index) => {
        response += `${index + 1}. ${course.title} - €${course.startPrice}<br>`;
    });
    
    return response;
}

function generateCountryResponse(query) {
    const extractedCountry = extractCountry(query);
    
    if (!extractedCountry) {
        return 'Please specify a country. For example: "What courses are available in Germany?"';
    }
    
    const countryCourses = coursesData.filter(course => 
        course.country.toLowerCase().includes(extractedCountry.toLowerCase())
    );
    
    if (countryCourses.length === 0) {
        return `No courses found in ${extractedCountry}. Available countries: ${[...new Set(coursesData.map(c => c.country))].join(', ')}`;
    }
    
    const categories = [...new Set(countryCourses.map(c => c.category))];
    const avgPrice = countryCourses.reduce((sum, course) => sum + course.startPrice, 0) / countryCourses.length;
    
    let response = `<strong>🌍 Courses in ${extractedCountry}:</strong><br><br>`;
    response += `📚 <strong>Total Courses:</strong> ${countryCourses.length}<br>`;
    response += `🏷️ <strong>Categories:</strong> ${categories.join(', ')}<br>`;
    response += `💰 <strong>Average Price:</strong> €${Math.round(avgPrice)}<br><br>`;
    
    response += `<strong>Featured Courses:</strong><br>`;
    countryCourses.slice(0, 5).forEach((course, index) => {
        response += `${index + 1}. ${course.title} (${course.category}) - €${course.startPrice}<br>`;
    });
    
    return response;
}

function generateCategoryResponse(query) {
    const extractedCategory = extractCategory(query);
    
    if (!extractedCategory) {
        return 'Please specify a category. For example: "What CV courses are available?"';
    }
    
    const categoryCourses = coursesData.filter(course => 
        course.category.toLowerCase().includes(extractedCategory.toLowerCase())
    );
    
    if (categoryCourses.length === 0) {
        return `No courses found in category "${extractedCategory}". Available categories: ${[...new Set(coursesData.map(c => c.category))].join(', ')}`;
    }
    
    const countries = [...new Set(categoryCourses.map(c => c.country))];
    const avgPrice = categoryCourses.reduce((sum, course) => sum + course.startPrice, 0) / categoryCourses.length;
    
    let response = `<strong>🏷️ ${extractedCategory} Courses:</strong><br><br>`;
    response += `📚 <strong>Total Courses:</strong> ${categoryCourses.length}<br>`;
    response += `🌍 <strong>Available Countries:</strong> ${countries.join(', ')}<br>`;
    response += `💰 <strong>Average Price:</strong> €${Math.round(avgPrice)}<br><br>`;
    
    response += `<strong>Top Rated Courses:</strong><br>`;
    const topRated = categoryCourses.sort((a, b) => b.rating - a.rating).slice(0, 5);
    topRated.forEach((course, index) => {
        response += `${index + 1}. ${course.title} - ⭐${course.rating}/5 - €${course.startPrice}<br>`;
    });
    
    return response;
}

function generateProviderResponse(query) {
    const extractedProvider = query.match(/(?:provider|company|from)\s+(.+)/i);
    
    if (!extractedProvider) {
        return 'Please specify a provider. For example: "What courses does CareerBoost offer?"';
    }
    
    const providerName = extractedProvider[1].trim();
    const providerCourses = coursesData.filter(course => 
        course.provider.name.toLowerCase().includes(providerName.toLowerCase())
    );
    
    if (providerCourses.length === 0) {
        return `No courses found from provider "${providerName}". Available providers: ${[...new Set(coursesData.map(c => c.provider.name))].join(', ')}`;
    }
    
    const categories = [...new Set(providerCourses.map(c => c.category))];
    const avgPrice = providerCourses.reduce((sum, course) => sum + course.startPrice, 0) / providerCourses.length;
    
    let response = `<strong>🏢 Courses from ${providerCourses[0].provider.name}:</strong><br><br>`;
    response += `📚 <strong>Total Courses:</strong> ${providerCourses.length}<br>`;
    response += `🏷️ <strong>Categories:</strong> ${categories.join(', ')}<br>`;
    response += `💰 <strong>Average Price:</strong> €${Math.round(avgPrice)}<br>`;
    response += `📝 <strong>About:</strong> ${providerCourses[0].provider.description}<br><br>`;
    
    response += `<strong>Available Courses:</strong><br>`;
    providerCourses.forEach((course, index) => {
        response += `${index + 1}. ${course.title} (${course.category}) - €${course.startPrice}<br>`;
    });
    
    return response;
}

function generateSpecificCourseResponse(query) {
    const courseName = query.match(/(?:course|about|details)\s+(.+)/i);
    
    if (!courseName) {
        return 'Please specify a course. For example: "Tell me about the CV optimization course"';
    }
    
    const searchTerm = courseName[1].trim();
    const course = coursesData.find(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (!course) {
        return `Course "${searchTerm}" not found. Try searching for a different course.`;
    }
    
    let response = `<strong>📚 Course Details: ${course.title}</strong><br><br>`;
    response += `📍 <strong>Location:</strong> ${course.country}<br>`;
    response += `🏷️ <strong>Category:</strong> ${course.category}<br>`;
    response += `💰 <strong>Price:</strong> €${course.startPrice}<br>`;
    response += `⏱️ <strong>Duration:</strong> ${course.duration}<br>`;
    response += `💻 <strong>Format:</strong> ${course.format}<br>`;
    response += `⭐ <strong>Rating:</strong> ${course.rating}/5 (${course.totalReviews} reviews)<br><br>`;
    
    response += `<strong>Description:</strong><br>${course.description}<br><br>`;
    
    if (course.services && course.services.length > 0) {
        response += `<strong>Services Included:</strong><br>`;
        course.services.forEach(service => {
            response += `• ${service}<br>`;
        });
        response += `<br>`;
    }
    
    response += `<strong>Provider:</strong> ${course.provider.name}<br>`;
    response += `${course.provider.description}<br><br>`;
    
    response += `<em>💡 Ready to enroll? Click the "Enroll Now" button on the course card!</em>`;
    
    return response;
}

function generateDefaultResponse(query) {
    return `I can help you with information about courses, prices, countries, categories, and providers! Here are some things you can ask me:
    
• "What courses are available in Germany?"
• "Tell me about CV optimization courses"
• "What's the price range for interview preparation?"
• "Compare different medical courses"
• "Recommend courses for beginners"
• "What courses does CareerBoost offer?"

Try asking me something specific! 🎓`;
}

function extractCountry(query) {
    const countries = ['Germany', 'France', 'Spain', 'Italy', 'Netherlands', 'Belgium', 'Austria', 'Switzerland'];
    for (const country of countries) {
        if (query.toLowerCase().includes(country.toLowerCase())) {
            return country;
        }
    }
    return null;
}

function extractCategory(query) {
    const categories = ['CV', 'Interview', 'Medical', 'Corporate', 'IT', 'Language'];
    for (const category of categories) {
        if (query.toLowerCase().includes(category.toLowerCase())) {
            return category;
        }
    }
    return null;
}

// Load courses data
function loadCourses() {
    fetch('courses.json')
        .then(response => response.json())
        .then(data => {
            coursesData = data;
            renderCourses();
            initializeAnalytics();
        })
        .catch(error => {
            console.error('Error loading courses:', error);
            // Fallback to sample data if JSON loading fails
            coursesData = [
                {
                    id: 'cv-1',
                    title: 'Professional CV Optimization Workshop',
                    description: 'Transform your CV into a powerful tool that gets you noticed by European employers.',
                    description2: 'This comprehensive workshop covers modern CV writing techniques and keyword optimization.',
                    country: 'Germany',
                    category: 'CV',
                    startPrice: 149,
                    priceTier: 'mid',
                    duration: '2 weeks',
                    format: 'Online',
                    rating: 4.7,
                    totalReviews: 23,
                    provider: {
                        name: 'CareerBoost Europe',
                        description: 'Leading career development consultancy with over 10 years of experience.'
                    }
                }
            ];
            renderCourses();
        });
}

// Enhanced course filtering and search
function applyAdvancedFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const countryFilter = document.getElementById('countryFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    const minPrice = parseFloat(document.getElementById('minPriceFilter').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPriceFilter').value) || Infinity;
    const durationFilter = document.getElementById('durationFilter').value;
    const formatFilter = document.getElementById('formatFilter').value;
    const ratingFilter = parseFloat(document.getElementById('ratingFilter').value) || 0;
    const sortBy = document.getElementById('sortFilter').value;

    let filteredCourses = coursesData.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm) ||
                            course.description.toLowerCase().includes(searchTerm) ||
                            course.description2.toLowerCase().includes(searchTerm);
        const matchesCountry = countryFilter === 'all' || course.country === countryFilter;
        const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
        const matchesPrice = course.startPrice >= minPrice && course.startPrice <= maxPrice;
        const matchesDuration = durationFilter === 'all' || course.duration.includes(durationFilter);
        const matchesFormat = formatFilter === 'all' || course.format === formatFilter;
        const matchesRating = course.rating >= ratingFilter;

        return matchesSearch && matchesCountry && matchesCategory && matchesPrice && 
               matchesDuration && matchesFormat && matchesRating;
    });

    // Apply sorting
    if (sortBy === 'price-low') {
        filteredCourses.sort((a, b) => a.startPrice - b.startPrice);
    } else if (sortBy === 'price-high') {
        filteredCourses.sort((a, b) => b.startPrice - a.startPrice);
    } else if (sortBy === 'rating') {
        filteredCourses.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'popularity') {
        filteredCourses.sort((a, b) => b.totalReviews - a.totalReviews);
    }

    renderCourses(filteredCourses);
    updateFilterCounts(filteredCourses.length);
}

function updateFilterCounts(count) {
    const countElement = document.getElementById('filterCount');
    if (countElement) {
        countElement.textContent = `${count} courses found`;
    }
}

// Dashboard Analytics
function initializeAnalytics() {
    if (!window.Chart) {
        console.warn('Chart.js not loaded');
        return;
    }

    // Course Category Distribution
    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx) {
        const categoryData = getCategoryDistribution();
        new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: categoryData.labels,
                datasets: [{
                    data: categoryData.values,
                    backgroundColor: [
                        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }

    // Price Analysis Chart
    const priceCtx = document.getElementById('priceChart');
    if (priceCtx) {
        const priceData = getPriceAnalysis();
        new Chart(priceCtx, {
            type: 'bar',
            data: {
                labels: priceData.labels,
                datasets: [{
                    label: 'Average Price',
                    data: priceData.values,
                    backgroundColor: '#3B82F6'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    // Popularity Trends
    const popularityCtx = document.getElementById('popularityChart');
    if (popularityCtx) {
        const popularityData = getPopularityTrends();
        new Chart(popularityCtx, {
            type: 'line',
            data: {
                labels: popularityData.labels,
                datasets: [{
                    label: 'Course Popularity',
                    data: popularityData.values,
                    borderColor: '#10B981',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
}

function getCategoryDistribution() {
    const categories = {};
    coursesData.forEach(course => {
        categories[course.category] = (categories[course.category] || 0) + 1;
    });
    
    return {
        labels: Object.keys(categories),
        values: Object.values(categories)
    };
}

function getPriceAnalysis() {
    const priceRanges = {
        '€0-100': 0,
        '€101-200': 0,
        '€201-300': 0,
        '€301-500': 0,
        '€500+': 0
    };

    coursesData.forEach(course => {
        if (course.startPrice <= 100) priceRanges['€0-100']++;
        else if (course.startPrice <= 200) priceRanges['€101-200']++;
        else if (course.startPrice <= 300) priceRanges['€201-300']++;
        else if (course.startPrice <= 500) priceRanges['€301-500']++;
        else priceRanges['€500+']++;
    });

    return {
        labels: Object.keys(priceRanges),
        values: Object.values(priceRanges)
    };
}

function getPopularityTrends() {
    const sortedCourses = [...coursesData].sort((a, b) => b.totalReviews - a.totalReviews);
    const topCourses = sortedCourses.slice(0, 10);
    
    return {
        labels: topCourses.map(course => course.title.substring(0, 20) + '...'),
        values: topCourses.map(course => course.totalReviews)
    };
}

// Progress Tracking
function initializeProgressTracking() {
    if (currentUser) {
        loadUserProgress();
        renderProgressDashboard();
    }
}

function loadUserProgress() {
    const saved = localStorage.getItem('userProgress');
    if (saved) {
        userProgress = JSON.parse(saved);
    }
}

function saveUserProgress() {
    localStorage.setItem('userProgress', JSON.stringify(userProgress));
}

function updateCourseProgress(courseId, status) {
    if (!currentUser) return;
    
    userProgress[courseId] = {
        status: status,
        lastUpdated: new Date().toISOString(),
        completedLessons: status === 'completed' ? 100 : 0
    };
    
    saveUserProgress();
    renderProgressDashboard();
}

function renderProgressDashboard() {
    const progressContainer = document.getElementById('progressContent');
    if (!progressContainer) return;

    const inProgress = Object.values(userProgress).filter(p => p.status === 'in-progress').length;
    const completed = Object.values(userProgress).filter(p => p.status === 'completed').length;
    const totalEnrolled = Object.keys(userProgress).length;

    progressContainer.innerHTML = `
        <div class="progress-stats">
            <div class="stat-card">
                <h3>${totalEnrolled}</h3>
                <p>Enrolled Courses</p>
            </div>
            <div class="stat-card">
                <h3>${inProgress}</h3>
                <p>In Progress</p>
            </div>
            <div class="stat-card">
                <h3>${completed}</h3>
                <p>Completed</p>
            </div>
        </div>
        <div class="progress-list">
            <h3>Your Learning Journey</h3>
            ${renderProgressList()}
        </div>
    `;
}

function renderProgressList() {
    if (Object.keys(userProgress).length === 0) {
        return '<p>No courses enrolled yet. Start your learning journey!</p>';
    }

    return Object.entries(userProgress).map(([courseId, progress]) => {
        const course = coursesData.find(c => c.id === courseId);
        if (!course) return '';
        
        const progressBar = progress.status === 'completed' ? 100 : 
                           progress.status === 'in-progress' ? 50 : 0;
        
        return `
            <div class="progress-item">
                <div class="course-info">
                    <h4>${course.title}</h4>
                    <p>${course.category} • ${course.provider.name}</p>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressBar}%"></div>
                </div>
                <div class="progress-status">
                    <span class="status-badge ${progress.status}">${progress.status}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Community Features
function initializeCommunity() {
    renderCommunityDashboard();
    loadCommunityPosts();
}

function renderCommunityDashboard() {
    const communityContainer = document.getElementById('communityContent');
    if (!communityContainer) return;

    communityContainer.innerHTML = `
        <div class="community-header">
            <h2>Learning Community</h2>
            <button class="btn btn-primary" onclick="showCreatePost()">Create Post</button>
        </div>
        <div class="community-stats">
            <div class="stat-card">
                <h3>${communityPosts.length}</h3>
                <p>Total Posts</p>
            </div>
            <div class="stat-card">
                <h3>${getActiveUsers()}</h3>
                <p>Active Users</p>
            </div>
        </div>
        <div class="community-filters">
            <select id="postCategoryFilter" onchange="filterCommunityPosts()">
                <option value="all">All Categories</option>
                <option value="discussion">Discussion</option>
                <option value="question">Question</option>
                <option value="review">Review</option>
                <option value="resource">Resource</option>
            </select>
        </div>
        <div id="communityPosts" class="community-posts">
            <!-- Posts will be loaded here -->
        </div>
    `;
}

function loadCommunityPosts() {
    const postsContainer = document.getElementById('communityPosts');
    if (!postsContainer) return;

    postsContainer.innerHTML = communityPosts.map(post => `
        <div class="community-post">
            <div class="post-header">
                <div class="user-info">
                    <div class="user-avatar">${post.author.charAt(0).toUpperCase()}</div>
                    <div>
                        <h4>${post.author}</h4>
                        <span class="post-date">${formatDate(post.date)}</span>
                    </div>
                </div>
                <span class="post-category ${post.category}">${post.category}</span>
            </div>
            <div class="post-content">
                <h3>${post.title}</h3>
                <p>${post.content}</p>
            </div>
            <div class="post-actions">
                <button onclick="likePost(${post.id})" class="action-btn">
                    👍 ${post.likes}
                </button>
                <button onclick="showComments(${post.id})" class="action-btn">
                    💬 ${post.comments.length}
                </button>
                <button onclick="sharePost(${post.id})" class="action-btn">
                    📤 Share
                </button>
            </div>
        </div>
    `).join('');
}

function showCreatePost() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Create New Post</h3>
            <form onsubmit="createPost(event)">
                <select id="postCategory" required>
                    <option value="">Select Category</option>
                    <option value="discussion">Discussion</option>
                    <option value="question">Question</option>
                    <option value="review">Review</option>
                    <option value="resource">Resource</option>
                </select>
                <input type="text" id="postTitle" placeholder="Post Title" required>
                <textarea id="postContent" placeholder="Post Content" required></textarea>
                <div class="modal-actions">
                    <button type="button" onclick="closeModal()" class="btn btn-secondary">Cancel</button>
                    <button type="submit" class="btn btn-primary">Create Post</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

function createPost(event) {
    event.preventDefault();
    
    const category = document.getElementById('postCategory').value;
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    
    const newPost = {
        id: Date.now(),
        author: currentUser || 'Anonymous',
        category: category,
        title: title,
        content: content,
        date: new Date().toISOString(),
        likes: 0,
        comments: []
    };
    
    communityPosts.unshift(newPost);
    closeModal();
    loadCommunityPosts();
    renderCommunityDashboard();
}

function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

function likePost(postId) {
    const post = communityPosts.find(p => p.id === postId);
    if (post) {
        post.likes++;
        loadCommunityPosts();
    }
}

function showComments(postId) {
    // Implementation for showing comments
    console.log('Show comments for post:', postId);
}

function sharePost(postId) {
    // Implementation for sharing posts
    console.log('Share post:', postId);
}

function filterCommunityPosts() {
    const category = document.getElementById('postCategoryFilter').value;
    const filteredPosts = category === 'all' ? 
        communityPosts : 
        communityPosts.filter(post => post.category === category);
    
    const postsContainer = document.getElementById('communityPosts');
    if (!postsContainer) return;

    postsContainer.innerHTML = filteredPosts.map(post => `
        <div class="community-post">
            <div class="post-header">
                <div class="user-info">
                    <div class="user-avatar">${post.author.charAt(0).toUpperCase()}</div>
                    <div>
                        <h4>${post.author}</h4>
                        <span class="post-date">${formatDate(post.date)}</span>
                    </div>
                </div>
                <span class="post-category ${post.category}">${post.category}</span>
            </div>
            <div class="post-content">
                <h3>${post.title}</h3>
                <p>${post.content}</p>
            </div>
            <div class="post-actions">
                <button onclick="likePost(${post.id})" class="action-btn">
                    👍 ${post.likes}
                </button>
                <button onclick="showComments(${post.id})" class="action-btn">
                    💬 ${post.comments.length}
                </button>
                <button onclick="sharePost(${post.id})" class="action-btn">
                    📤 Share
                </button>
            </div>
        </div>
    `).join('');
}

// Corporate Solutions
function initializeCorporate() {
    renderCorporateDashboard();
}

function renderCorporateDashboard() {
    const corporateContainer = document.getElementById('corporateContent');
    if (!corporateContainer) return;

    corporateContainer.innerHTML = `
        <div class="corporate-header">
            <h2>Corporate Training Solutions</h2>
            <p>Empower your team with professional development programs</p>
        </div>
        <div class="corporate-stats">
            <div class="stat-card">
                <h3>${getCorporateStats().totalCompanies}</h3>
                <p>Companies Served</p>
            </div>
            <div class="stat-card">
                <h3>${getCorporateStats().totalEmployees}</h3>
                <p>Employees Trained</p>
            </div>
            <div class="stat-card">
                <h3>${getCorporateStats().satisfactionRate}%</h3>
                <p>Satisfaction Rate</p>
            </div>
        </div>
        <div class="corporate-services">
            <h3>Our Services</h3>
            <div class="services-grid">
                <div class="service-card">
                    <h4>Bulk Enrollment</h4>
                    <p>Enroll multiple employees in courses with volume discounts</p>
                    <button class="btn btn-primary" onclick="showBulkEnrollment()">Learn More</button>
                </div>
                <div class="service-card">
                    <h4>Custom Training</h4>
                    <p>Tailored programs designed for your specific needs</p>
                    <button class="btn btn-primary" onclick="showCustomTraining()">Learn More</button>
                </div>
                <div class="service-card">
                    <h4>Training Packages</h4>
                    <p>Comprehensive learning paths for different roles</p>
                    <button class="btn btn-primary" onclick="showTrainingPackages()">Learn More</button>
                </div>
            </div>
        </div>
        <div class="corporate-contact">
            <h3>Get Started</h3>
            <p>Contact our corporate team for a personalized consultation</p>
            <button class="btn btn-primary" onclick="showCorporateContact()">Contact Us</button>
        </div>
    `;
}

function getCorporateStats() {
    return {
        totalCompanies: 150,
        totalEmployees: 2500,
        satisfactionRate: 98
    };
}

function showBulkEnrollment() {
    // Implementation for bulk enrollment modal
    console.log('Show bulk enrollment');
}

function showCustomTraining() {
    // Implementation for custom training modal
    console.log('Show custom training');
}

function showTrainingPackages() {
    // Implementation for training packages modal
    console.log('Show training packages');
}

function showCorporateContact() {
    // Implementation for corporate contact modal
    console.log('Show corporate contact');
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function getActiveUsers() {
    return Math.floor(Math.random() * 100) + 50;
}

// Enhanced course rendering with badges and meta information
function renderCourses(courses = coursesData) {
    const coursesContainer = document.getElementById('coursesGrid');
    if (!coursesContainer) return;

    coursesContainer.innerHTML = courses.map(course => `
        <div class="course-card" data-category="${course.category}" data-country="${course.country}">
            <div class="course-header">
                <div class="course-logo">
                    <img src="${course.logoURL || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎓</text></svg>"}" 
                         alt="${course.title}" onerror="this.src='data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎓</text></svg>'">
                </div>
                <div class="course-badges">
                    ${course.badges ? course.badges.map(badge => 
                        `<span class="badge" style="background-color: ${badge.color}">${badge.icon} ${badge.text}</span>`
                    ).join('') : ''}
                </div>
            </div>
            <div class="course-content">
                <h3 class="course-title">${course.title}</h3>
                <p class="course-description">${course.description}</p>
                <div class="course-meta">
                    <span class="meta-item"><i class="fas fa-map-marker-alt"></i> ${course.country}</span>
                    <span class="meta-item"><i class="fas fa-tag"></i> ${course.category}</span>
                    <span class="meta-item"><i class="fas fa-clock"></i> ${course.duration}</span>
                    <span class="meta-item"><i class="fas fa-video"></i> ${course.format}</span>
                </div>
                <div class="course-rating">
                    <div class="stars">
                        ${generateStars(course.rating)}
                    </div>
                    <span class="rating-text">${course.rating} (${course.totalReviews} reviews)</span>
                </div>
                <div class="course-provider">
                    <strong>${course.provider.name}</strong>
                    <p>${course.provider.description}</p>
                </div>
            </div>
            <div class="course-footer">
                <div class="course-price">
                    <span class="price">€${course.startPrice}</span>
                    <span class="price-tier">${course.priceTier}</span>
                </div>
                <div class="course-actions">
                    <button class="btn btn-primary" onclick="enrollCourse('${course.id || course.title}')">Enroll Now</button>
                    <button class="btn btn-secondary" onclick="viewCourseDetails('${course.id || course.title}')">View Details</button>
                </div>
            </div>
        </div>
    `).join('');
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

function enrollCourse(courseId) {
    if (!currentUser) {
        alert('Please log in to enroll in courses');
        return;
    }
    
    updateCourseProgress(courseId, 'enrolled');
    alert('Successfully enrolled in course!');
}

function viewCourseDetails(courseId) {
    const course = coursesData.find(c => (c.id || c.title) === courseId);
    if (!course) return;
    
    // Implementation for course details modal
    console.log('View course details:', course);
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadCourses();
    initializeAnalytics();
    initializeProgressTracking();
    initializeCommunity();
    initializeCorporate();
    
    // Set up event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Search and filter events
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', applyAdvancedFilters);
    }
    
    // Filter change events
    const filterElements = ['countryFilter', 'categoryFilter', 'minPriceFilter', 'maxPriceFilter', 
                           'durationFilter', 'formatFilter', 'ratingFilter', 'sortFilter'];
    
    filterElements.forEach(filterId => {
        const element = document.getElementById(filterId);
        if (element) {
            element.addEventListener('change', applyAdvancedFilters);
        }
    });
    
    // AI chat events
    const chatToggle = document.getElementById('chatToggle');
    if (chatToggle) {
        chatToggle.addEventListener('click', toggleChat);
    }
    
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    const sendButton = document.getElementById('sendButton');
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
}