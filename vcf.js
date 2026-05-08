// --- 1. INITIALIZATION ---
// Replace these with your actual Supabase project credentials
const SUPABASE_URL = "https://nianlnujdqnkzlesnlbp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pYW5sbnVqZHFua3psZXNubGJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MDg2NDQsImV4cCI6MjA5MzI4NDY0NH0.YDu4ejDYnW82Wj1LUBSCwFKHyZA0LLaiif0zTegceW4";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- 2. ELEMENT SELECTORS ---
const contactForm = document.querySelector(".contact-reg");
const submitBtn = document.getElementById("submit-form");

let num1, num2, correctAnswer;

function generateQuestion() {
  num1 = Math.floor(Math.random() * 10);
  num2 = Math.floor(Math.random() * 10);
  correctAnswer = num1 + num2;

  document.getElementById("math-question").innerText =
    `Solve this to continue: ${num1} + ${num2} = ?`;
}

// Run when page loads
generateQuestion();

// --- 3. EVENT LISTENER ---
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevents the default form submission (page reload)

  // Capture input values
  const fullname = document.getElementById("fullname").value.trim();
  const phonenumber = document.getElementById("phonenumber").value.trim();
  const college = document.getElementById("college").value;
  
let phone = phonenumber.replace(/\D/g, "");

if (phone.startsWith("0")) {
  phone = "233" + phone.substring(1);
}

if (!phone.startsWith("233") || phone.length !== 12) {
  alert("Enter a valid Ghana phone number.");
  return;
}
  // Simple validation check
  if (!fullname || !phonenumber || !college) {
    alert("Please fill in all fields correctly.");
    return;
}

  const userAnswer = parseInt(document.getElementById("math-answer").value);

  if (isNaN(userAnswer) || userAnswer !== correctAnswer) {
    alert("Incorrect answer. Please try again.");
    generateQuestion();
    submitBtn.disabled = false;
    submitBtn.innerText = "Submit";
    return;
}

  // UI Feedback: Disable button while processing
  submitBtn.disabled = true;
  submitBtn.innerText = "Processing...";

  try {
    
    // --- 4. SUPABASE INSERTION ---
const { data: existing } = await _supabase
  .from("contacts")
  .select("id")
  .eq("phonenumber", phone)
  .maybeSingle();

if (existing) {
  alert("This number is already registered.");
  submitBtn.disabled = false;
  submitBtn.innerText = "Submit";
  return;
  }
   
    const { data, error } = await _supabase
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
    alert("Error: Could not save your contact.");
  }
  throw error;
}
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
