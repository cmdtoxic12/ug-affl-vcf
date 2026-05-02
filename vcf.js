// --- 1. INITIALIZATION ---
// Replace these with your actual Supabase project credentials
const SUPABASE_URL = "https://nianlnujdqnkzlesnlbp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pYW5sbnVqZHFua3psZXNubGJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzcwODY0NCwiZXhwIjoyMDkzMjg0NjQ0fQ.dDky9qzdOi3Kczffe36ctbtsprFfdD4PKdHb7x2VDjo";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- 2. ELEMENT SELECTORS ---
const contactForm = document.querySelector(".contact-reg");
const submitBtn = document.getElementById("submit-form");

// --- 3. EVENT LISTENER ---
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevents the default form submission (page reload)

  // Capture input values
  const fullname = document.getElementById("fullname").value.trim();
  const phonenumber = document.getElementById("phonenumber").value.trim();
  const college = document.getElementById("college").value;

  // Simple validation check
  if (!fullname || !phonenumber || !college) {
    alert("Please fill in all fields correctly.");
    return;
  }

  // UI Feedback: Disable button while processing
  submitBtn.disabled = true;
  submitBtn.innerText = "Processing...";

  try {
    // --- 4. SUPABASE INSERTION ---
    const { data, error } = await _supabase
      .from("contacts") // Ensure your table name is 'contacts'
      .insert([
        {
          fullname: fullname,
          phonenumber: phonenumber,
          college: college,
        },
      ]);

    if (error) throw error;

    // --- 5. SUCCESS HANDLING ---
    alert(`Success! ${fullname}, you've been added to the L100 VCF list.`);
    contactForm.reset(); // Clear the form for the next user
  } catch (err) {
    console.error("Submission Error:", err.message);
    alert("Error: Could not save your contact. Please try again.");
  } finally {
    // Reset UI state
    submitBtn.disabled = false;
    submitBtn.innerText = "Submit";
  }
});
