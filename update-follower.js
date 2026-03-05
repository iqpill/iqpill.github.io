const fs = require('fs');

// --- CONFIGURATION ---
const INSTAGRAM_ID = '72163374974'; 
const HTML_FILE = 'index.html';

// --- FETCH DATA ---
async function updateFollowers() {
    try {
        console.log('Fetching Instagram data...');
        const response = await fetch(`https://socialcounts.org/api/instagram/v1/user/${INSTAGRAM_ID}`);
        
        if (!response.ok) {
            console.error('API request failed');
            return;
        }

        const data = await response.json();
        const count = data.subscriberCount || data.est_sub_count || data.followers;
        
        if (!count) {
            console.error('Could not find follower count');
            return;
        }

        console.log(`Current Followers: ${count}`);

        // --- UPDATE HTML ---
        let html = fs.readFileSync(HTML_FILE, 'utf8');
        
        // Looks for: let followers=1250;
        const regex = /let followers=\d+;/;
        
        if (regex.test(html)) {
            html = html.replace(regex, `let followers=${count};`);
            fs.writeFileSync(HTML_FILE, html);
            console.log('✅ HTML Updated Successfully');
        } else {
            console.log('❌ Could not find the follower line in HTML.');
        }

    } catch (error) {
        console.error('Error updating followers:', error);
    }
}

updateFollowers();
