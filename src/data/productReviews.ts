import { CustomerReview } from '../types';

export const INITIAL_PRODUCT_REVIEWS: Record<string, CustomerReview[]> = {
  // 1. BCAA
  'nautilus-bcaa-2-1-1-lemon-450g': [
    {
      id: 'rev-bcaa-1',
      productId: 'nautilus-bcaa-2-1-1-lemon-450g',
      productName: 'Nautilus BCAA 2:1:1 Intra-Workout Recovery Formula – Tangy Lemon',
      customerName: 'Hamza Tariq',
      city: 'Lahore, Punjab',
      rating: 5,
      headline: 'Best intra-workout in Pakistan. Tangy lemon tastes amazing!',
      comment: 'Tastes like real lemon, zero bitter aftertaste. I sip this during heavy leg workouts and the DOMS next day is reduced by at least 50%. Dissolves completely in cold water without shaking for minutes.',
      date: '2 days ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-bcaa-2',
      productId: 'nautilus-bcaa-2-1-1-lemon-450g',
      productName: 'Nautilus BCAA 2:1:1 Intra-Workout Recovery Formula – Tangy Lemon',
      customerName: 'Zubair Shah',
      city: 'Karachi, Sindh',
      rating: 5,
      headline: 'Pure 2:1:1 ratio with 45 full servings. Worth every rupee.',
      comment: 'Usually brands give only 30 servings, but Nautilus provides 45 full servings (450g). Kept my muscle intact during Ramadan fasted workouts. High quality recovery.',
      date: '1 week ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-bcaa-3',
      productId: 'nautilus-bcaa-2-1-1-lemon-450g',
      productName: 'Nautilus BCAA 2:1:1 Intra-Workout Recovery Formula – Tangy Lemon',
      customerName: 'Bilal Ahmed Khan',
      city: 'Islamabad',
      rating: 5,
      headline: 'Electrolytes keep hydration high with no cramps.',
      comment: 'Added glutamine and electrolytes make a noticeable difference in stamina. Fast express delivery to Islamabad within 2 days with authentic seal intact.',
      date: '2 weeks ago',
      verifiedPurchase: true,
      status: 'approved'
    }
  ],

  // 2. Biotin
  'nautilus-high-potency-d-biotin-5000mcg-60caps': [
    {
      id: 'rev-bio-1',
      productId: 'nautilus-high-potency-d-biotin-5000mcg-60caps',
      productName: 'Nautilus High-Potency D-Biotin 5000 mcg',
      customerName: 'Dr. Ayesha Malik',
      city: 'Karachi, Sindh',
      rating: 5,
      headline: 'Noticeable drop in hair fall within 4 weeks!',
      comment: 'After recovering from illness I had severe hair shedding. 5000 mcg clinical D-Biotin helped anchor the roots and my nail brittleness is completely gone. 100% Halal veg capsules.',
      date: '3 days ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-bio-2',
      productId: 'nautilus-high-potency-d-biotin-5000mcg-60caps',
      productName: 'Nautilus High-Potency D-Biotin 5000 mcg',
      customerName: 'Usman Ghani',
      city: 'Rawalpindi',
      rating: 5,
      headline: 'Hair thickness improved and skin feels healthier.',
      comment: 'Clean pharmaceutical grade. No stomach irritation at all when taken after breakfast. 2 months supply in one bottle is great value.',
      date: '1 week ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-bio-3',
      productId: 'nautilus-high-potency-d-biotin-5000mcg-60caps',
      productName: 'Nautilus High-Potency D-Biotin 5000 mcg',
      customerName: 'Fatima Noor',
      city: 'Lahore, Punjab',
      rating: 5,
      headline: 'My nails are no longer chipping or splitting.',
      comment: 'Very pleased with the result. Took 1 capsule daily consistently for 40 days. Visible new baby hair growth along my hairline.',
      date: '3 weeks ago',
      verifiedPurchase: true,
      status: 'approved'
    }
  ],

  // 3. Creatine 405g
  'nautilus-micronized-creatine-monohydrate-405g': [
    {
      id: 'rev-cre-1',
      productId: 'nautilus-micronized-creatine-monohydrate-405g',
      productName: 'Nautilus Ultra-Pure Micronized Creatine Monohydrate – Creapure Grade',
      customerName: 'Muhammad Arsalan',
      city: 'Faisalabad',
      rating: 5,
      headline: 'Bench press went up by 10kg in 3 weeks!',
      comment: 'Ultra fine 200-mesh powder. Dissolves seamlessly without leaving sandy sediment at the bottom of the glass. True Creapure grade with zero bloat.',
      date: '4 days ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-cre-2',
      productId: 'nautilus-micronized-creatine-monohydrate-405g',
      productName: 'Nautilus Ultra-Pure Micronized Creatine Monohydrate – Creapure Grade',
      customerName: 'Omer Farooq',
      city: 'Lahore, Punjab',
      rating: 5,
      headline: 'Full 90 servings for 3 months supply. Pure quality.',
      comment: '405g tub with 4.5g scoop is the exact saturation dosage. Muscles look noticeably fuller and dense. Best creatine brand in Pakistan.',
      date: '1 week ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-cre-3',
      productId: 'nautilus-micronized-creatine-monohydrate-405g',
      productName: 'Nautilus Ultra-Pure Micronized Creatine Monohydrate – Creapure Grade',
      customerName: 'Kashif Mehmood',
      city: 'Multan',
      rating: 5,
      headline: 'Zero stomach cramps and genuine purity.',
      comment: 'I usually have gastric issues with cheap creatine brands, but this 200-mesh micronized creatine gave zero distress. 10/10 authenticity.',
      date: '2 weeks ago',
      verifiedPurchase: true,
      status: 'approved'
    }
  ],

  // 4. Creatine + CoQ10
  'nautilus-3-in-1-cellular-energy-creatine-omega3-coq10': [
    {
      id: 'rev-cq-1',
      productId: 'nautilus-3-in-1-cellular-energy-creatine-omega3-coq10',
      productName: 'Nautilus 3-in-1 Cellular Energy Complex – Creatine, Omega-3 & CoQ10',
      customerName: 'Tariq Jamil',
      city: 'Karachi, Sindh',
      rating: 5,
      headline: 'Convenient softgel! No powder hassle, no fishy burps.',
      comment: 'The enteric coating works as described—zero fish reflux. Creatine combined with CoQ10 keeps my cardiovascular stamina and joint mobility high.',
      date: '5 days ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-cq-2',
      productId: 'nautilus-3-in-1-cellular-energy-creatine-omega3-coq10',
      productName: 'Nautilus 3-in-1 Cellular Energy Complex – Creatine, Omega-3 & CoQ10',
      customerName: 'Saad Rafique',
      city: 'Islamabad',
      rating: 5,
      headline: 'Great for high performance athletes over 30.',
      comment: 'CoQ10 fuels mitochondrial energy while Omega-3 keeps systemic inflammation low. Noticeable improvement in focus and physical recovery.',
      date: '1 week ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-cq-3',
      productId: 'nautilus-3-in-1-cellular-energy-creatine-omega3-coq10',
      productName: 'Nautilus 3-in-1 Cellular Energy Complex – Creatine, Omega-3 & CoQ10',
      customerName: 'Danish Ali',
      city: 'Sialkot',
      rating: 5,
      headline: 'Complete 3-in-1 stack saves money and effort.',
      comment: 'Buying high-grade Omega-3, CoQ10 and Creatine separately costs over 9,000. Getting this synergistic complex for 4,500 is unbeatable value.',
      date: '3 weeks ago',
      verifiedPurchase: true,
      status: 'approved'
    }
  ],

  // 5. Fast Protein Chocolate 5 Lbs
  'nautilus-fast-protein-whey-chocolate-5lbs': [
    {
      id: 'rev-fp-choc-1',
      productId: 'nautilus-fast-protein-whey-chocolate-5lbs',
      productName: 'Nautilus Fast Protein 100% Whey Protein Concentrate – Rich Dutch Chocolate',
      customerName: 'Capt. Zain Ul Abideen',
      city: 'Peshawar',
      rating: 5,
      headline: 'Digests fast with zero bloating. 25g pure protein per scoop.',
      comment: 'Takes only 30-45 minutes to digest. I take it right after workouts and feel recovered within an hour. Rich chocolate flavor is not excessively sweet.',
      date: '1 day ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-fp-choc-2',
      productId: 'nautilus-fast-protein-whey-chocolate-5lbs',
      productName: 'Nautilus Fast Protein 100% Whey Protein Concentrate – Rich Dutch Chocolate',
      customerName: 'Shahzaib Raza',
      city: 'Lahore, Punjab',
      rating: 5,
      headline: '75 full servings in a 5 Lbs tub! Lab tested quality.',
      comment: 'Excellent mixability in a normal shaker cup. No foam, no clumping. 2.7g Leucine gives genuine anabolic response for muscle growth.',
      date: '4 days ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-fp-choc-3',
      productId: 'nautilus-fast-protein-whey-chocolate-5lbs',
      productName: 'Nautilus Fast Protein 100% Whey Protein Concentrate – Rich Dutch Chocolate',
      customerName: 'Adnan Siddiqui',
      city: 'Karachi, Sindh',
      rating: 5,
      headline: 'Authentic product with quick nationwide delivery.',
      comment: 'Ordered online and got delivery in 24 hours in Karachi. Original packaging with QR seal. My go-to whey protein for cutting.',
      date: '2 weeks ago',
      verifiedPurchase: true,
      status: 'approved'
    }
  ],

  // 6. Fast Protein Vanilla 5 Lbs
  'nautilus-fast-protein-whey-vanilla-5lbs': [
    {
      id: 'rev-fp-van-1',
      productId: 'nautilus-fast-protein-whey-vanilla-5lbs',
      productName: 'Nautilus Fast Protein 100% Whey Protein Concentrate – French Vanilla Cream',
      customerName: 'Waleed Sheikh',
      city: 'Islamabad',
      rating: 5,
      headline: 'Smooth French Vanilla taste. Blends perfectly with oats.',
      comment: 'Clean vanilla taste without chemical scent. I mix 1 scoop into my morning oatmeal and it creates a delicious custard texture with 25g protein.',
      date: '3 days ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-fp-van-2',
      productId: 'nautilus-fast-protein-whey-vanilla-5lbs',
      productName: 'Nautilus Fast Protein 100% Whey Protein Concentrate – French Vanilla Cream',
      customerName: 'Mubeen Akhtar',
      city: 'Gujranwala',
      rating: 5,
      headline: 'Zero amino spiking. Pure dairy whey.',
      comment: 'Checked the lab stats. Intact WPC 80% raw material. Noticeable hypertrophy gains in shoulders and chest over the last 6 weeks.',
      date: '1 week ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-fp-van-3',
      productId: 'nautilus-fast-protein-whey-vanilla-5lbs',
      productName: 'Nautilus Fast Protein 100% Whey Protein Concentrate – French Vanilla Cream',
      customerName: 'Haris Qureshi',
      city: 'Karachi, Sindh',
      rating: 5,
      headline: 'Light on the stomach, zero lactose issues.',
      comment: 'I usually have lactose sensitivity with regular milk, but this ultra-filtered vanilla whey digests without any gas or heaviness.',
      date: '2 weeks ago',
      verifiedPurchase: true,
      status: 'approved'
    }
  ],

  // 7. Triple Magnesium
  'nautilus-triple-magnesium-complex-60tabs': [
    {
      id: 'rev-mag-1',
      productId: 'nautilus-triple-magnesium-complex-60tabs',
      productName: 'Nautilus Triple Magnesium Complex – Glycinate, Citrate & Oxide',
      customerName: 'Asadullah Baig',
      city: 'Lahore, Punjab',
      rating: 5,
      headline: 'Deep sleep like a baby. Muscle cramps completely gone.',
      comment: 'Take 2 tablets 45 minutes before sleep. Deep restful sleep with vivid dreams and zero calf twitches in the middle of the night. Glycinate form is top tier.',
      date: '2 days ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-mag-2',
      productId: 'nautilus-triple-magnesium-complex-60tabs',
      productName: 'Nautilus Triple Magnesium Complex – Glycinate, Citrate & Oxide',
      customerName: 'Kamran Hafeez',
      city: 'Islamabad',
      rating: 5,
      headline: '400mg elemental yield. Non-habit forming relaxation.',
      comment: 'Much better than melatonin which causes morning grogginess. This mineral complex relaxes the central nervous system naturally.',
      date: '5 days ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-mag-3',
      productId: 'nautilus-triple-magnesium-complex-60tabs',
      productName: 'Nautilus Triple Magnesium Complex – Glycinate, Citrate & Oxide',
      customerName: 'Noman Riaz',
      city: 'Abbottabad',
      rating: 5,
      headline: 'Helped activate my Vitamin D3 levels significantly.',
      comment: 'My doctor advised magnesium alongside D3. Blood test showed optimal levels after 2 months on this complex. Very satisfied.',
      date: '2 weeks ago',
      verifiedPurchase: true,
      status: 'approved'
    }
  ],

  // 8. Mass 25 Chocolate 1kg
  'nautilus-clean-calorie-mass-gainer-chocolate-1kg': [
    {
      id: 'rev-m25-c-1',
      productId: 'nautilus-clean-calorie-mass-gainer-chocolate-1kg',
      productName: 'Nautilus Clean Calorie Mass Gainer – Rich Dutch Chocolate (1 kg)',
      customerName: 'Rehan Butt',
      city: 'Sialkot',
      rating: 5,
      headline: 'Gained 2.5 kg lean weight in 3 weeks!',
      comment: 'The 1:2 ratio (15g protein / 30g carbs) is perfect. Not like cheap gainers with 80% sugar. Gained solid muscle size on arms and chest without belly fat.',
      date: '3 days ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-m25-c-2',
      productId: 'nautilus-clean-calorie-mass-gainer-chocolate-1kg',
      productName: 'Nautilus Clean Calorie Mass Gainer – Rich Dutch Chocolate (1 kg)',
      customerName: 'Ahsan Qureshi',
      city: 'Karachi, Sindh',
      rating: 5,
      headline: 'Tastes like an authentic chocolate shake with cold milk.',
      comment: 'Mixes easily in shaker. 2 scoops after workout gives sustained energy. Great entry-level size to test results before buying the 50-serving tub.',
      date: '1 week ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-m25-c-3',
      productId: 'nautilus-clean-calorie-mass-gainer-chocolate-1kg',
      productName: 'Nautilus Clean Calorie Mass Gainer – Rich Dutch Chocolate (1 kg)',
      customerName: 'Faizan Elahi',
      city: 'Rawalpindi',
      rating: 5,
      headline: 'No bloating or stomach heaviness at all.',
      comment: 'Clean maltodextrin and whey blend. Perfect for hardgainers who have trouble eating large volumes of solid food.',
      date: '2 weeks ago',
      verifiedPurchase: true,
      status: 'approved'
    }
  ],

  // 9. Mass 50 Chocolate 2.25kg
  'nautilus-clean-calorie-mass-gainer-chocolate-2-25kg': [
    {
      id: 'rev-m50-c-1',
      productId: 'nautilus-clean-calorie-mass-gainer-chocolate-2-25kg',
      productName: 'Nautilus Clean Calorie Mass Gainer – Rich Dutch Chocolate (2.25 kg)',
      customerName: 'Junaid Bashir',
      city: 'Multan',
      rating: 5,
      headline: 'Full 50-day bulking cycle. Gained 4.5 kg solid mass.',
      comment: 'Consistency is everything in bulking. Having 50 full servings allowed me to take 1 shake daily for almost 2 months. Best mass gainer in Pakistan.',
      date: '2 days ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-m50-c-2',
      productId: 'nautilus-clean-calorie-mass-gainer-chocolate-2-25kg',
      productName: 'Nautilus Clean Calorie Mass Gainer – Rich Dutch Chocolate (2.25 kg)',
      customerName: 'Sufyan Ali',
      city: 'Lahore, Punjab',
      rating: 5,
      headline: 'Rich chocolate flavor with milk and peanut butter.',
      comment: 'I blend 2 scoops with milk, 1 banana and peanut butter. It creates an 800 calorie powerhouse smoothie. Muscle thickness increased noticeably.',
      date: '6 days ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-m50-c-3',
      productId: 'nautilus-clean-calorie-mass-gainer-chocolate-2-25kg',
      productName: 'Nautilus Clean Calorie Mass Gainer – Rich Dutch Chocolate (2.25 kg)',
      customerName: 'Daniyal Mir',
      city: 'Islamabad',
      rating: 5,
      headline: 'Authentic clean calories with zero unlisted stimulants.',
      comment: 'Lab-tested formulation. No cheap sugar spikes or afternoon energy crashes. Highly recommend for serious lifters.',
      date: '3 weeks ago',
      verifiedPurchase: true,
      status: 'approved'
    }
  ],

  // 10. Mass 50 Special Gourmet
  'nautilus-mass-gainer-special-gourmet-chocolate-2-25kg': [
    {
      id: 'rev-m50-sp-1',
      productId: 'nautilus-mass-gainer-special-gourmet-chocolate-2-25kg',
      productName: 'Nautilus Mass Gainer Special Gourmet Edition – Rich Chocolate',
      customerName: 'Farhan Chaudhry',
      city: 'Lahore, Punjab',
      rating: 5,
      headline: 'Gourmet cocoa tastes incredible! Like a premium dessert shake.',
      comment: 'The artisanal flavor system is on another level. Extremely creamy and smooth. Best tasting gainer I have ever tried in 6 years of training.',
      date: '1 day ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-m50-sp-2',
      productId: 'nautilus-mass-gainer-special-gourmet-chocolate-2-25kg',
      productName: 'Nautilus Mass Gainer Special Gourmet Edition – Rich Chocolate',
      customerName: 'Ali Raza Zaidi',
      city: 'Karachi, Sindh',
      rating: 5,
      headline: 'Same proven 1:2 macro ratio with enhanced solubility.',
      comment: 'Shakes up smooth in under 15 seconds without a blender. 15g protein and 30g complex carbs is the gold standard for clean bulking.',
      date: '5 days ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-m50-sp-3',
      productId: 'nautilus-mass-gainer-special-gourmet-chocolate-2-25kg',
      productName: 'Nautilus Mass Gainer Special Gourmet Edition – Rich Chocolate',
      customerName: 'Tayyab Mahmood',
      city: 'Faisalabad',
      rating: 5,
      headline: 'Great value at PKR 11,900 for 50 servings.',
      comment: 'Same price as standard edition with upgraded taste. Fast express delivery to Faisalabad. Highly satisfied customer.',
      date: '2 weeks ago',
      verifiedPurchase: true,
      status: 'approved'
    }
  ],

  // 11. Mass Vanilla 25 (1kg)
  'nautilus-clean-calorie-mass-gainer-vanilla-1kg': [
    {
      id: 'rev-m25-v-1',
      productId: 'nautilus-clean-calorie-mass-gainer-vanilla-1kg',
      productName: 'Nautilus Clean Calorie Mass Gainer – French Vanilla Cream (1 kg)',
      customerName: 'Hassan Nisar',
      city: 'Gujrat',
      rating: 5,
      headline: 'Smooth vanilla taste. Great starter pack.',
      comment: 'Vanilla flavor is very balanced and natural. Mixes well with milk and doesn’t leave a chalky aftertaste. Ideal for beginners starting their bulk.',
      date: '4 days ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-m25-v-2',
      productId: 'nautilus-clean-calorie-mass-gainer-vanilla-1kg',
      productName: 'Nautilus Clean Calorie Mass Gainer – French Vanilla Cream (1 kg)',
      customerName: 'Zeeshan Akbar',
      city: 'Karachi, Sindh',
      rating: 5,
      headline: 'Gained 2 kg in 2 weeks. Zero stomach pain.',
      comment: 'Clean complex carbs provide steady energy throughout the day. Very gentle on the digestive system.',
      date: '1 week ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-m25-v-3',
      productId: 'nautilus-clean-calorie-mass-gainer-vanilla-1kg',
      productName: 'Nautilus Clean Calorie Mass Gainer – French Vanilla Cream (1 kg)',
      customerName: 'Ibrahim Khalil',
      city: 'Peshawar',
      rating: 5,
      headline: 'Perfect base for high-calorie smoothies.',
      comment: 'I love adding dates, almonds and banana with this vanilla gainer. Delicious shake with 30g complex carbs and 15g protein.',
      date: '2 weeks ago',
      verifiedPurchase: true,
      status: 'approved'
    }
  ],

  // 12. Mass Vanilla 50 (2.25kg)
  'nautilus-clean-calorie-mass-gainer-vanilla-2-25kg': [
    {
      id: 'rev-m50-v-1',
      productId: 'nautilus-clean-calorie-mass-gainer-vanilla-2-25kg',
      productName: 'Nautilus Clean Calorie Mass Gainer – French Vanilla Cream (2.25 kg)',
      customerName: 'Nouman Saeed',
      city: 'Bahawalpur',
      rating: 5,
      headline: '5 Lbs economy tub lasted me 7 full weeks.',
      comment: 'Took 1 shake daily between breakfast and lunch. Steady, visible gains on arms and quads. Vanilla flavor never gets tiring.',
      date: '3 days ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-m50-v-2',
      productId: 'nautilus-clean-calorie-mass-gainer-vanilla-2-25kg',
      productName: 'Nautilus Clean Calorie Mass Gainer – French Vanilla Cream (2.25 kg)',
      customerName: 'Mudassar Nazir',
      city: 'Lahore, Punjab',
      rating: 5,
      headline: 'Economical bulking fuel for student athletes.',
      comment: 'Best price per serving for authentic sports nutrition in Pakistan. Customer support on WhatsApp was prompt and helpful.',
      date: '1 week ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-m50-v-3',
      productId: 'nautilus-clean-calorie-mass-gainer-vanilla-2-25kg',
      productName: 'Nautilus Clean Calorie Mass Gainer – French Vanilla Cream (2.25 kg)',
      customerName: 'Salman Lodhi',
      city: 'Rawalpindi',
      rating: 5,
      headline: 'High nitrogen retention and solid strength gains.',
      comment: 'Natural BCAAs and glutamine in the formula help speed up recovery between heavy training sessions. 5 stars.',
      date: '3 weeks ago',
      verifiedPurchase: true,
      status: 'approved'
    }
  ],

  // 13. Multivitamin
  'nautilus-complete-daily-multivitamin-90tabs': [
    {
      id: 'rev-multi-1',
      productId: 'nautilus-complete-daily-multivitamin-90tabs',
      productName: 'Nautilus Complete Daily Multivitamin & Mineral Complex',
      customerName: 'Dr. Shahbaz Alam',
      city: 'Lahore, Punjab',
      rating: 5,
      headline: 'Balanced formulation with safe 5mg iron. No nausea!',
      comment: 'Most drugstore vitamins carry 18mg iron which causes constipation in men. Nautilus uses a medically safe 5mg dose with complete B-complex and 1000 IU Vitamin D3. Superb.',
      date: '2 days ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-multi-2',
      productId: 'nautilus-complete-daily-multivitamin-90tabs',
      productName: 'Nautilus Complete Daily Multivitamin & Mineral Complex',
      customerName: 'Murtaza Hassan',
      city: 'Karachi, Sindh',
      rating: 5,
      headline: 'Daytime fatigue is gone. Energy stays constant.',
      comment: 'I take 1 tablet after breakfast. Noticeable lift in focus and afternoon stamina without caffeine jitters. 90 tablets covers 3 full months.',
      date: '1 week ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-multi-3',
      productId: 'nautilus-complete-daily-multivitamin-90tabs',
      productName: 'Nautilus Complete Daily Multivitamin & Mineral Complex',
      customerName: 'Sohail Cheema',
      city: 'Islamabad',
      rating: 5,
      headline: 'Immunity defense is solid. Haven’t caught seasonal flu.',
      comment: 'Synergy of Vitamin C (80mg), Zinc (15mg), and D3 keeps immunity strong through intense gym training cycles.',
      date: '2 weeks ago',
      verifiedPurchase: true,
      status: 'approved'
    }
  ],

  // 14. Shaker Bottle
  'nautilus-premium-leak-proof-gym-shaker-700ml': [
    {
      id: 'rev-shk-1',
      productId: 'nautilus-premium-leak-proof-gym-shaker-700ml',
      productName: 'Nautilus Premium Leak-Proof Gym Shaker Bottle (700 ml / 24 oz)',
      customerName: 'Awais Rajput',
      city: 'Karachi, Sindh',
      rating: 5,
      headline: '100% leak proof! Whisk ball mixes mass gainers effortlessly.',
      comment: 'Tossed it inside my gym bag and zero liquid spilled. Stainless steel ball breaks down thick mass gainers in under 15 seconds.',
      date: '3 days ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-shk-2',
      productId: 'nautilus-premium-leak-proof-gym-shaker-700ml',
      productName: 'Nautilus Premium Leak-Proof Gym Shaker Bottle (700 ml / 24 oz)',
      customerName: 'Hamid Gul',
      city: 'Lahore, Punjab',
      rating: 5,
      headline: 'BPA-free plastic doesn’t hold foul odors.',
      comment: 'Regular shakers smell terrible after a week, but this food-grade PP plastic cleans easily with warm water. Embossed ml marks are very clear.',
      date: '1 week ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-shk-3',
      productId: 'nautilus-premium-leak-proof-gym-shaker-700ml',
      productName: 'Nautilus Premium Leak-Proof Gym Shaker Bottle (700 ml / 24 oz)',
      customerName: 'Talha Bin Tariq',
      city: 'Rawalpindi',
      rating: 5,
      headline: 'Premium build quality for under 1,000 PKR.',
      comment: 'Looks and feels like imported shaker bottles costing 2,500+. The snap lid clicks shut tightly with reassuring grip.',
      date: '2 weeks ago',
      verifiedPurchase: true,
      status: 'approved'
    }
  ],

  // 15. Whey 33 Chocolate 1kg
  'nautilus-pure-whey-concentrate-chocolate-1kg': [
    {
      id: 'rev-w33-c-1',
      productId: 'nautilus-pure-whey-concentrate-chocolate-1kg',
      productName: 'Nautilus 100% Pure Whey Protein Concentrate – Rich Dutch Chocolate (1 kg)',
      customerName: 'Naveed Akhtar',
      city: 'Lahore, Punjab',
      rating: 5,
      headline: 'Authentic cross-flow WPC 80. Real 25g protein.',
      comment: 'Cold-filtered whey preserves native immunoglobulins. Taste is smooth Dutch cocoa with zero grittiness or chalky texture.',
      date: '2 days ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-w33-c-2',
      productId: 'nautilus-pure-whey-concentrate-chocolate-1kg',
      productName: 'Nautilus 100% Pure Whey Protein Concentrate – Rich Dutch Chocolate (1 kg)',
      customerName: 'Adeel Chaudhry',
      city: 'Karachi, Sindh',
      rating: 5,
      headline: 'Zero amino spiking. 5.8g BCAAs per scoop.',
      comment: 'Tested it for muscle recovery during fasting. Prevents muscle soreness completely and aids lean definition.',
      date: '5 days ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-w33-c-3',
      productId: 'nautilus-pure-whey-concentrate-chocolate-1kg',
      productName: 'Nautilus 100% Pure Whey Protein Concentrate – Rich Dutch Chocolate (1 kg)',
      customerName: 'Waqas Bhatti',
      city: 'Sialkot',
      rating: 5,
      headline: 'Great 1-month supply for serious lifters.',
      comment: '33 servings per tub at PKR 6,500 is fantastic value for 83.3% concentration. Fast delivery by Nautilus courier.',
      date: '3 weeks ago',
      verifiedPurchase: true,
      status: 'approved'
    }
  ],

  // 16. Whey 75 Chocolate 2.25kg
  'nautilus-pure-whey-concentrate-chocolate-2-25kg': [
    {
      id: 'rev-w75-c-1',
      productId: 'nautilus-pure-whey-concentrate-chocolate-2-25kg',
      productName: 'Nautilus 100% Pure Whey Protein Concentrate – Rich Dutch Chocolate (2.25 kg)',
      customerName: 'Rana Hammad',
      city: 'Faisalabad',
      rating: 5,
      headline: '75 full servings economy pack! Muscle gains are real.',
      comment: 'Been drinking 2 scoops daily for 5 weeks. Gained 3kg lean muscle while reducing body fat percentage. Authentic seal and batch code.',
      date: '1 day ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-w75-c-2',
      productId: 'nautilus-pure-whey-concentrate-chocolate-2-25kg',
      productName: 'Nautilus 100% Pure Whey Protein Concentrate – Rich Dutch Chocolate (2.25 kg)',
      customerName: 'Fahad Mustafa',
      city: 'Islamabad',
      rating: 5,
      headline: '2.7g Leucine activates mTOR pathway every time.',
      comment: 'I take it within 30 minutes of lifting. Noticeable reduction in DOMS and muscle fullness lasts all day. Highly recommended.',
      date: '4 days ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-w75-c-3',
      productId: 'nautilus-pure-whey-concentrate-chocolate-2-25kg',
      productName: 'Nautilus 100% Pure Whey Protein Concentrate – Rich Dutch Chocolate (2.25 kg)',
      customerName: 'Mohsin Naqvi',
      city: 'Karachi, Sindh',
      rating: 5,
      headline: 'Best whey deal in Pakistan. 100% Halal certified.',
      comment: 'Non-animal microbial rennet used in whey separation. Clean, lab-verified purity and peace of mind.',
      date: '2 weeks ago',
      verifiedPurchase: true,
      status: 'approved'
    }
  ],

  // 17. Whey Vanilla 33 (1kg)
  'nautilus-pure-whey-concentrate-vanilla-1kg': [
    {
      id: 'rev-w33-v-1',
      productId: 'nautilus-pure-whey-concentrate-vanilla-1kg',
      productName: 'Nautilus 100% Pure Whey Protein Concentrate – French Vanilla Cream (1 kg)',
      customerName: 'Shoaib Malik',
      city: 'Lahore, Punjab',
      rating: 5,
      headline: 'Clean natural vanilla flavor. Smooth texture.',
      comment: 'Very versatile. Mixes easily into cold water or low-fat milk. Doesn’t leave any chemical aftertaste. 25g protein per scoop is legit.',
      date: '3 days ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-w33-v-2',
      productId: 'nautilus-pure-whey-concentrate-vanilla-1kg',
      productName: 'Nautilus 100% Pure Whey Protein Concentrate – French Vanilla Cream (1 kg)',
      customerName: 'Ammar Yasir',
      city: 'Karachi, Sindh',
      rating: 5,
      headline: 'Excellent mixability in shaker cup.',
      comment: 'Dissolves in 15 seconds without clumps. I add it to pancakes and smoothies for high-protein breakfast.',
      date: '1 week ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-w33-v-3',
      productId: 'nautilus-pure-whey-concentrate-vanilla-1kg',
      productName: 'Nautilus 100% Pure Whey Protein Concentrate – French Vanilla Cream (1 kg)',
      customerName: 'Danyal Bukhari',
      city: 'Rawalpindi',
      rating: 5,
      headline: 'Fast digestion and lean muscle retention.',
      comment: 'Used it during my fat-loss cut. Maintained muscle mass while dropping 4kg body fat. 5 stars.',
      date: '2 weeks ago',
      verifiedPurchase: true,
      status: 'approved'
    }
  ],

  // 18. Whey Vanilla 75 (2.25kg)
  'nautilus-pure-whey-concentrate-vanilla-2-25kg': [
    {
      id: 'rev-w75-v-1',
      productId: 'nautilus-pure-whey-concentrate-vanilla-2-25kg',
      productName: 'Nautilus 100% Pure Whey Protein Concentrate – French Vanilla Cream (2.25 kg)',
      customerName: 'Zahid Hussain',
      city: 'Peshawar',
      rating: 5,
      headline: 'Massive 5 Lbs container. Lasts 2.5 months easily.',
      comment: 'Very economical for daily athletes. French Vanilla Cream is light, refreshing, and tastes like melted ice cream with cold skim milk.',
      date: '2 days ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-w75-v-2',
      productId: 'nautilus-pure-whey-concentrate-vanilla-2-25kg',
      productName: 'Nautilus 100% Pure Whey Protein Concentrate – French Vanilla Cream (2.25 kg)',
      customerName: 'Rizwan Qureshi',
      city: 'Lahore, Punjab',
      rating: 5,
      headline: 'Zero added sugar and low fat profile.',
      comment: 'Only 1g naturally occurring milk sugar per scoop. Genuine imported raw whey material packaged under strict quality control.',
      date: '6 days ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-w75-v-3',
      productId: 'nautilus-pure-whey-concentrate-vanilla-2-25kg',
      productName: 'Nautilus 100% Pure Whey Protein Concentrate – French Vanilla Cream (2.25 kg)',
      customerName: 'Saad Farooqi',
      city: 'Islamabad',
      rating: 5,
      headline: 'Superb customer service and prompt delivery.',
      comment: 'Got my 5 Lbs tub in Islamabad within 48 hours of ordering. Packaging was secure with bubble wrap and sealed tub.',
      date: '3 weeks ago',
      verifiedPurchase: true,
      status: 'approved'
    }
  ],

  // 19. Zinc 20mg
  'nautilus-high-absorption-elemental-zinc-20mg-90tabs': [
    {
      id: 'rev-zn-1',
      productId: 'nautilus-high-absorption-elemental-zinc-20mg-90tabs',
      productName: 'Nautilus High-Absorption Elemental Zinc 20 mg – Advanced Zinc Sulphate Formula',
      customerName: 'Dr. Bilal Qazi',
      city: 'Karachi, Sindh',
      rating: 5,
      headline: '20mg is the scientifically correct dose. No stomach upset!',
      comment: 'Drugstore 50mg zinc causes severe nausea and drains copper. Nautilus uses 20mg pure elemental zinc which provides therapeutic immunity and testosterone support with zero nausea.',
      date: '2 days ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-zn-2',
      productId: 'nautilus-high-absorption-elemental-zinc-20mg-90tabs',
      productName: 'Nautilus High-Absorption Elemental Zinc 20 mg – Advanced Zinc Sulphate Formula',
      customerName: 'Yasir Mehmood',
      city: 'Lahore, Punjab',
      rating: 5,
      headline: 'Hair fall stopped and skin acne cleared up.',
      comment: 'Been taking 1 tablet daily with lunch. Noticeable reduction in hair shedding in the shower after 3 weeks. Skin feels clearer too.',
      date: '1 week ago',
      verifiedPurchase: true,
      status: 'approved'
    },
    {
      id: 'rev-zn-3',
      productId: 'nautilus-high-absorption-elemental-zinc-20mg-90tabs',
      productName: 'Nautilus High-Absorption Elemental Zinc 20 mg – Advanced Zinc Sulphate Formula',
      customerName: 'Haroon Rashid',
      city: 'Islamabad',
      rating: 5,
      headline: 'Essential for hard-training athletes. 90 days supply.',
      comment: 'Zinc is lost in sweat during training. This 90-tablet bottle covers 3 months of essential mineral replenishment. High quality.',
      date: '2 weeks ago',
      verifiedPurchase: true,
      status: 'approved'
    }
  ]
};
