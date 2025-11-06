import { useState, useEffect } from 'react';
import { Send, RotateCcw, Star, Trophy, Loader2 } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  context: string;
  idealAnswer: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "Apa yang dimaksud dengan Pemrograman Berorientasi Objek (OOP) dalam PHP?",
    context: "OOP (Object Oriented Programming) adalah paradigma pemrograman yang berfokus pada penggunaan objek, di mana setiap objek memiliki data (property) dan fungsi (method). Dalam PHP, OOP membantu dalam membuat kode yang modular, reusable, dan mudah dikelola.",
    idealAnswer: "OOP adalah paradigma pemrograman yang menggunakan objek berisi property dan method untuk membangun program secara modular dan reusable di PHP."
  },
  {
    id: 2,
    question: "Jelaskan perbedaan antara class dan object dalam PHP?",
    context: "Class adalah blueprint atau template untuk membuat objek, sedangkan object adalah instance konkret yang dibuat berdasarkan class tersebut. Misalnya, class `Mobil` bisa memiliki objek `mobilSaya` dan `mobilTeman`.",
    idealAnswer: "Class adalah cetak biru atau template, sedangkan object adalah instance nyata yang dibuat dari class tersebut."
  },
  {
    id: 3,
    question: "Apa itu inheritance (pewarisan) dalam PHP OOP?",
    context: "Inheritance memungkinkan sebuah class untuk mewarisi properti dan metode dari class lain. Ini memudahkan penggunaan kembali kode dan memperluas fungsionalitas tanpa menulis ulang logika yang sama.",
    idealAnswer: "Inheritance adalah mekanisme di mana class dapat mewarisi properti dan metode dari class lain untuk memudahkan reuse dan pengembangan kode."
  },
  {
    id: 4,
    question: "Jelaskan konsep encapsulation dalam PHP!",
    context: "Encapsulation adalah pembungkusan data dan metode dalam satu kesatuan (class), serta membatasi akses ke properti atau metode menggunakan modifier seperti public, private, dan protected.",
    idealAnswer: "Encapsulation membungkus data dan metode dalam class serta membatasi aksesnya menggunakan public, private, atau protected."
  },
  {
    id: 5,
    question: "Apa itu polymorphism dalam PHP OOP?",
    context: "Polymorphism memungkinkan objek dari berbagai class untuk diakses melalui interface atau class induk yang sama, dengan setiap class memiliki implementasi yang berbeda terhadap method yang sama.",
    idealAnswer: "Polymorphism adalah kemampuan objek berbeda untuk menggunakan method yang sama dengan cara atau hasil yang berbeda."
  },
  {
    id: 6,
    question: "Apa yang dimaksud dengan REST API dalam konteks PHP?",
    context: "REST API (Representational State Transfer) adalah arsitektur yang memungkinkan komunikasi antara client dan server melalui protokol HTTP. Dalam PHP, REST API biasanya dibangun untuk menyediakan data dalam format JSON dengan method seperti GET, POST, PUT, dan DELETE.",
    idealAnswer: "REST API adalah layanan berbasis HTTP yang memungkinkan client berkomunikasi dengan server untuk mengakses atau mengubah data menggunakan method seperti GET, POST, PUT, dan DELETE."
  },
  {
    id: 7,
    question: "Bagaimana cara membuat endpoint GET sederhana pada REST API di PHP?",
    context: "Endpoint GET digunakan untuk mengambil data dari server. Di PHP, biasanya menggunakan `$_SERVER['REQUEST_METHOD'] == 'GET'` untuk memeriksa permintaan, kemudian mengirimkan data dalam format JSON menggunakan `echo json_encode($data);`.",
    idealAnswer: "Gunakan metode GET di PHP dengan memeriksa `$_SERVER['REQUEST_METHOD'] == 'GET'` dan kembalikan data dalam format JSON."
  },
  {
    id: 8,
    question: "Apa perbedaan antara REST API dan SOAP API dalam PHP?",
    context: "REST API menggunakan HTTP dengan format ringan seperti JSON atau XML dan lebih mudah diimplementasikan. SOAP menggunakan protokol XML dengan struktur yang ketat dan lebih kompleks. REST cenderung lebih cepat dan fleksibel untuk web modern.",
    idealAnswer: "REST API menggunakan HTTP dan JSON yang ringan, sedangkan SOAP API menggunakan XML yang lebih kompleks dan formal."
  },
  {
    id: 9,
    question: "Bagaimana cara mengimplementasikan autentikasi token pada REST API PHP?",
    context: "Autentikasi token digunakan untuk mengamankan API agar hanya pengguna sah yang bisa mengaksesnya. Salah satu cara umum adalah menggunakan JWT (JSON Web Token), di mana server mengeluarkan token saat login dan client mengirimkannya di header Authorization untuk setiap permintaan.",
    idealAnswer: "Gunakan JWT sebagai token autentikasi: server memberi token saat login, lalu client mengirim token di header Authorization pada setiap request."
  },
  {
    id: 10,
    question: "Jelaskan bagaimana konsep CRUD diterapkan dalam REST API PHP!",
    context: "CRUD (Create, Read, Update, Delete) adalah operasi dasar pada data. Dalam REST API PHP, tiap operasi diwakili oleh method HTTP: POST untuk Create, GET untuk Read, PUT untuk Update, dan DELETE untuk Delete. Setiap endpoint menangani satu jenis operasi terhadap resource.",
    idealAnswer: "CRUD di REST API PHP menggunakan method HTTP: POST (Create), GET (Read), PUT (Update), dan DELETE (Delete) untuk mengelola resource."
  }
];

type AvatarMood = 'idle' | 'thinking' | 'happy' | 'neutral' | 'sad';
type AccuracyLevel = 'excellent' | 'good' | 'fair' | 'poor';

export default function AIQuizGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [avatarMood, setAvatarMood] = useState<AvatarMood>('idle');
  const [isBlinking, setIsBlinking] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [avatarMessage, setAvatarMessage] = useState("");
  const [answerEvaluations, setAnswerEvaluations] = useState<{ accuracy: AccuracyLevel, feedback: string, points: number }[]>([]);
  const [hasAnswered, setHasAnswered] = useState(false);

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Talking animation when showing question
  useEffect(() => {
    if (gameStarted && !showResult && !hasAnswered) {
      setIsTalking(true);
      setAvatarMood('thinking');
      setAvatarMessage(questions[currentQuestion].question);
      const timer = setTimeout(() => {
        setIsTalking(false);
        setAvatarMood('idle');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentQuestion, gameStarted, showResult, hasAnswered]);

  const evaluateAnswerWithAI = async (userAnswer: string, question: Question) => {
    try {
      const prompt = `Kamu adalah penilai jawaban kuis yang adil dan objektif. Evaluasi jawaban siswa berikut:

      Pertanyaan: ${question.question}

      Konteks/Jawaban Ideal: ${question.context}

      Jawaban Siswa: ${userAnswer}

      Berikan evaluasi dalam format berikut:
      AKURASI: [excellent/good/fair/poor]
      POIN: [0-25]
      FEEDBACK: [Penjelasan singkat 1-2 kalimat dalam bahasa Indonesia yang ramah dan konstruktif]

      Kriteria penilaan:
      - excellent (20-25 poin): Jawaban sangat tepat, lengkap, dan akurat
      - good (15-19 poin): Jawaban cukup tepat dengan sebagian besar konsep benar
      - fair (8-14 poin): Jawaban kurang tepat, hanya sebagian kecil yang benar
      - poor (0-7 poin): Jawaban sangat kurang tepat atau tidak relevan

      Berikan penilaian yang objektif dan adil.`;

      // >>>> panggil backend lokal kita (relative path) <<<<
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Proxy API request failed");
      }

      const data = await response.json();
      const aiResponse: string = data.aiText ?? "";

      // Parse AI response
      const accuracyMatch = aiResponse.match(/AKURASI:\s*(excellent|good|fair|poor)/i);
      const pointsMatch = aiResponse.match(/POIN:\s*(\d+)/i);
      const feedbackMatch = aiResponse.match(/FEEDBACK:\s*(.+?)(?=\n\n|\n[A-Z]+:|$)/is);

      const accuracy = (accuracyMatch?.[1]?.toLowerCase() || 'fair') as AccuracyLevel;
      const points = parseInt(pointsMatch?.[1] || '10');
      const feedback = feedbackMatch?.[1]?.trim() || 'Jawaban sudah cukup baik, terus belajar ya!';

      return { accuracy, points, feedback };
    } catch (error) {
      console.error('AI evaluation error:', error);

      // fallback offline similarity
      const similarity = calculateSimilarity(
        userAnswer.toLowerCase(),
        question.idealAnswer.toLowerCase()
      );
      if (similarity > 0.7) {
        return { accuracy: 'excellent' as AccuracyLevel, points: 23, feedback: 'Jawaban kamu sangat bagus dan akurat! 🎉' };
      } else if (similarity > 0.5) {
        return { accuracy: 'good' as AccuracyLevel, points: 17, feedback: 'Jawaban cukup bagus, ada beberapa konsep yang tepat! 👍' };
      } else if (similarity > 0.3) {
        return { accuracy: 'fair' as AccuracyLevel, points: 11, feedback: 'Jawaban kurang lengkap, coba pelajari lagi ya! 📚' };
      } else {
        return { accuracy: 'poor' as AccuracyLevel, points: 5, feedback: 'Jawaban belum tepat, jangan menyerah terus belajar! 💪' };
      }
    }
  };

  const calculateSimilarity = (str1: string, str2: string): number => {
    const words1 = str1.split(/\s+/);
    const words2 = str2.split(/\s+/);
    const commonWords = words1.filter(word => words2.some(w => w.includes(word) || word.includes(w)));
    return commonWords.length / Math.max(words1.length, words2.length);
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() || isEvaluating || hasAnswered) return;

    setIsEvaluating(true);
    setIsTalking(true);
    setAvatarMood('thinking');
    setAvatarMessage("Hmm, biarkan aku periksa jawabanmu... 🤔");

    const evaluation = await evaluateAnswerWithAI(userAnswer, questions[currentQuestion]);

    setAnswerEvaluations([...answerEvaluations, evaluation]);
    setScore(score + evaluation.points);
    setHasAnswered(true);

    // Set avatar mood based on accuracy
    if (evaluation.accuracy === 'excellent') {
      setAvatarMood('happy');
    } else if (evaluation.accuracy === 'good') {
      setAvatarMood('neutral');
    } else {
      setAvatarMood('sad');
    }

    setAvatarMessage(evaluation.feedback);
    setIsEvaluating(false);

    setTimeout(() => {
      setIsTalking(false);
    }, 3000);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setUserAnswer("");
      setHasAnswered(false);
      setAvatarMood('idle');
    } else {
      setShowResult(true);
      const avgScore = score / questions.length;
      setAvatarMood(avgScore >= 18 ? 'happy' : avgScore >= 12 ? 'neutral' : 'sad');
      setAvatarMessage(avgScore >= 18 ? "Luar biasa! Kamu sangat pintar! 🌟" : avgScore >= 12 ? "Bagus! Terus tingkatkan lagi ya! 👍" : "Jangan menyerah, terus belajar! 💪");
    }
  };

  const resetQuiz = () => {
    setGameStarted(false);
    setCurrentQuestion(0);
    setScore(0);
    setUserAnswer("");
    setShowResult(false);
    setAnswerEvaluations([]);
    setAvatarMood('idle');
    setAvatarMessage("");
    setHasAnswered(false);
    setIsEvaluating(false);
  };

  const startGame = () => {
    setGameStarted(true);
    setAvatarMood('thinking');
    setAvatarMessage("Halo! Aku akan menguji pemahamanmu dengan pertanyaan menarik! 🎮");
    setTimeout(() => {
      setAvatarMessage(questions[0].question);
    }, 2000);
  };

  const getAccuracyColor = (accuracy: AccuracyLevel) => {
    switch (accuracy) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'fair': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
    }
  };

  const getAccuracyLabel = (accuracy: AccuracyLevel) => {
    switch (accuracy) {
      case 'excellent': return 'Sangat Tepat';
      case 'good': return 'Cukup Tepat';
      case 'fair': return 'Kurang Tepat';
      case 'poor': return 'Sangat Kurang Tepat';
    }
  };

  // Avatar Component
  const Avatar = ({ mood }: { mood: AvatarMood }) => {
    const getEyes = () => {
      if (isBlinking) return '―  ―';
      if (mood === 'happy') return '◠  ◠';
      if (mood === 'sad') return '◡  ◡';
      if (mood === 'neutral') return '●  ●';
      return '●  ●';
    };

    const getMouth = () => {
      if (isTalking) return mood === 'happy' ? '◡' : mood === 'sad' ? '◠' : 'o';
      if (mood === 'happy') return '◡';
      if (mood === 'sad') return '◠';
      if (mood === 'neutral') return '―';
      return '―';
    };

    const getColor = () => {
      if (mood === 'happy') return 'from-yellow-400 to-orange-400';
      if (mood === 'sad') return 'from-blue-400 to-indigo-400';
      if (mood === 'neutral') return 'from-green-400 to-teal-400';
      return 'from-purple-400 to-pink-400';
    };

    return (
      <div className="relative">
        <div className={`w-32 h-32 rounded-full bg-linear-to-br ${getColor()} flex items-center justify-center shadow-2xl transition-all duration-300 ${isTalking ? 'scale-105' : 'scale-100'}`}>
          <div className="text-center">
            <div className="text-3xl mb-2 transition-all duration-200">{getEyes()}</div>
            <div className={`text-4xl transition-all duration-200 ${isTalking ? 'animate-pulse' : ''}`}>{getMouth()}</div>
          </div>
        </div>
        {mood === 'happy' && (
          <div className="absolute -top-2 -right-2">
            <Star className="w-8 h-8 text-yellow-400 fill-yellow-400 animate-bounce" />
          </div>
        )}
      </div>
    );
  };

  // Start Screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="mb-8 flex justify-center">
            <Avatar mood="idle" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 animate-pulse">Kuis AI Interaktif</h1>
          <p className="text-xl text-purple-200 mb-8">Jawab pertanyaan dengan kata-katamu sendiri!<br />AI akan menilai seberapa tepat jawabanmu 🤖</p>
          <button
            onClick={startGame}
            className="bg-linear-to-r from-yellow-400 to-orange-500 text-white px-12 py-4 rounded-full font-bold text-xl hover:scale-110 transition-transform shadow-2xl"
          >
            Mulai Bermain
          </button>
        </div>
      </div>
    );
  }

  // Result Screen
  if (showResult) {
    const maxScore = questions.length * 25;
    const percentage = (score / maxScore) * 100;

    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="bg-gray-100/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 max-w-2xl w-full border border-white border-opacity-20">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <Avatar mood={avatarMood} />
            </div>

            <h2 className="text-4xl font-bold text-white mb-4">Kuis Selesai!</h2>

            <div className="my-8 bg-gray-100/10 rounded-2xl p-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Trophy className="w-12 h-12 text-yellow-400" />
                <div className="text-6xl font-bold text-yellow-400">
                  {score}
                </div>
              </div>
              <p className="text-2xl text-purple-200">
                dari {maxScore} poin ({percentage.toFixed(0)}%)
              </p>
            </div>

            <div className="mb-6 text-left bg-gray-100/10 rounded-xl p-4 max-h-64 overflow-y-auto">
              <h3 className="font-semibold text-white mb-3 text-center">Hasil Evaluasi</h3>
              {answerEvaluations.map((evaluate, idx) => (
                <div key={idx} className="mb-3 bg-gray-100/10 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">Soal {idx + 1}</span>
                    <div className="flex items-center gap-2">
                      <span className={`${getAccuracyColor(evaluate.accuracy)} text-white text-xs px-2 py-1 rounded-full font-semibold`}>
                        {getAccuracyLabel(evaluate.accuracy)}
                      </span>
                      <span className="text-yellow-400 font-bold">{evaluate.points} pts</span>
                    </div>
                  </div>
                  <p className="text-purple-200 text-sm">{evaluate.feedback}</p>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <p className="text-xl font-semibold text-white">
                {avatarMessage}
              </p>
            </div>

            <button
              onClick={resetQuiz}
              className="bg-linear-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-bold hover:scale-110 transition-transform flex items-center gap-2 mx-auto shadow-xl"
            >
              <RotateCcw className="w-5 h-5" />
              Main Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Game Screen
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Score Board */}
        <div className="bg-gray-100/10 backdrop-blur-lg rounded-2xl p-4 mb-6 flex justify-between items-center border border-white border-opacity-20">
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            <span className="text-white font-bold text-xl">{score} poin</span>
          </div>
          <div className="text-white font-semibold">
            Soal {currentQuestion + 1}/{questions.length}
          </div>
        </div>

        {/* Main Game Area */}
        <div className="bg-gray-100/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white border-opacity-20">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <Avatar mood={avatarMood} />
            <div className="mt-4 bg-gray-100/20 rounded-2xl px-6 py-3 relative max-w-2xl">
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-100/20 rotate-45"></div>
              <p className="text-white text-lg font-medium text-center leading-relaxed">
                {avatarMessage || questions[currentQuestion].question}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-100/20 rounded-full h-3 mb-6">
            <div
              className="bg-linear-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Answer Input */}
          {!hasAnswered ? (
            <div className="space-y-4">
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    handleSubmitAnswer();
                  }
                }}
                placeholder="Ketik jawabanmu di sini... (Ctrl+Enter untuk kirim)"
                disabled={isEvaluating}
                className="w-full h-32 p-4 rounded-xl bg-gray-100/20 text-white placeholder-purple-300 border-2 border-white border-opacity-30 focus:border-yellow-400 focus:outline-none resize-none"
              />
              <button
                onClick={handleSubmitAnswer}
                disabled={!userAnswer.trim() || isEvaluating}
                className="w-full bg-linear-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isEvaluating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    AI Sedang Menilai...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Kirim Jawaban
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="text-center">
              <button
                onClick={handleNextQuestion}
                className="bg-linear-to-r from-green-400 to-teal-500 text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
              >
                {currentQuestion < questions.length - 1 ? 'Soal Berikutnya →' : 'Lihat Hasil'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}