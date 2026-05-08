// --- 1. INITIALIZATION ---
const SUPABASE_URL = "https://nianlnujdqnkzlesnlbp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // Truncated for display
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- 2. ELEMENT SELECTORS ---
const contactForm = document.querySelector(".contact-reg");
const submitBtn = document.getElementById("submit-form");

let num1, num2, correctAnswer;

function generateQuestion() {
  num1 = Math.floor(Math.random() * 10);
  num2 = Math.floor(Math.random() * 10);
  correctAnswer = num1 + num2;
  document.getElementById("math-question").innerText = `Solve this: ${num1} + ${num2} = ?`;
}

window.onload = generateQuestion;

// --- 3. EVENT LISTENER ---
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const phonenumber = document.getElementById("phonenumber").value.trim();
  const college = document.getElementById("college").value;
  const userAnswer = parseInt(document.getElementById("math-answer").value);

  // Phone Formatting (Ghana 233)
  let phone = phonenumber.replace(/\D/g, "");
  if (phone.startsWith("0")) phone = "233" + phone.substring(1);

  // Validation
  if (!fullname || !phonenumber || !college) {
    alert("Please fill in all fields.");
    return;
  }

  if (phone.length !== 12 || !phone.startsWith("233")) {
    alert("Enter a valid Ghana phone number (e.g., 054... or 233...)");
    return;
  }

  if (userAnswer !== correctAnswer) {
    alert("Incorrect math answer.");
    generateQuestion();
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerText = "Processing...";

  try {
    // Check for existing contact
    const { data: existing } = await _supabase
      .from("contacts")
      .select("id")
      .eq("phonenumber", phone)
      .maybeSingle();

    if (existing) {
      alert("This number is already registered.");
    } else {
      // Insertion
      const { error } = await _supabase
        .from("contacts")
        .insert([{ fullname, phonenumber: phone, college }]);

      if (error) throw error;

      alert(`Success! ${fullname}, you've been added.`);
      contactForm.reset();
      generateQuestion(); // Refresh math for next entry
    }
  } catch (err) {
    console.error("Submission Error:", err.message);
    alert("Error: Could not save your contact.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerText = "Submit";
  }
});
