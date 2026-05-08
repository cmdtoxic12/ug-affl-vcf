// --- 1. INITIALIZATION ---
// Replace these with your actual Supabase project credentials
const SUPABASE_URL = "https://nianlnujdqnkzlesnlbp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pYW5sbnVqZHFua3psZXNubGJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MDg2NDQsImV4cCI6MjA5MzI4NDY0NH0.YDu4ejDYnW82Wj1LUBSCwFKHyZA0LLaiif0zTegceW4";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- 2. ELEMENT SELECTORS ---
const contactForm = document.querySelector(".contact-reg");
const submitBtn = document.getElementById("submit-form");

// --- 3. EVENT LISTENER ---
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Capture input values
  const fullname = document.getElementById("fullname").value.trim();
  const phonenumber = document.getElementById("phonenumber").value.trim();
  const college = document.getElementById("college").value;

  // Normalize Ghana phone number
  let phone = phonenumber.replace(/\D/g, "");

  if (phone.startsWith("0")) {
    phone = "233" + phone.substring(1);
  }

  // Validation
  if (!fullname || !phonenumber || !college) {
    alert("Please fill in all fields correctly.");
    return;
  }

  // Ghana number validation
  if (!phone.startsWith("233") || phone.length !== 12) {
    alert("Enter a valid Ghana phone number.");
    return;
  }

  // UI Feedback
  submitBtn.disabled = true;
  submitBtn.innerText = "Processing...";

  try {
    // Check duplicates
    const { data: existing } = await _supabase
      .from("contacts")
      .select("id")
      .eq("phonenumber", phone)
      .maybeSingle();

    if (existing) {
      alert("This number is already registered.");
      return;
    }

    // Insert into database
    const { error } = await _supabase
      .from("contacts")
      .insert([
        {
          fullname,
          phonenumber: phone,
          college,
        },
      ]);

    if (error) {
      if (error.message.includes("duplicate")) {
        alert("This phone number is already registered.");
      } else {
        alert(error.message);
      }
      throw error;
    }

    // Success
    alert(`Success! ${fullname}, you've been added to the L100 VCF list.`);
    contactForm.reset();

  } catch (err) {
    console.error("Submission Error:", err.message);
    alert("Error: Could not save your contact. Please try again.");

  } finally {
    // Reset button
    submitBtn.disabled = false;
    submitBtn.innerText = "Submit";
  }
});
