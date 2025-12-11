import testimage from "../../../assets/image/MCQ/TestImage.png";

const QuestionData = [
  { id: 1, text: 'What is AML Codes?', type: 'multiple', options: ['Account Money Lock', 'Anti Money Laundering', 'Account Money Locker', 'Account Money Laundering'], correct: 1 },
  { id: 2, text: 'What does HTML stand for ?', type: 'multiple', options: ['Hyperlinks and Text Markup Language', 'Home Tool Markup Language', 'Hyper Text Markup Language', 'Hyper Tool Markup Language'], correct: 2 },
  { id: 3, text: 'The Earth is flat.', type: 'truefalse', options: ['True', 'False'], correct: 1 },
  { id: 4, text: 'What is the capital of France ?', type: 'multiple', options: ['Berlin', 'Madrid', 'Paris', 'London'], correct: 2 },
  { id: 5, text: '______ is the capital of Japan.', type: 'fillblank', correct: 'Tokyo' },
  { id: 6, text: 'Identify the highlighted organ in the diagram.', type: 'diagram', imageUrl: testimage, options: ['Liver', 'Heart', 'Kidney', 'Lung'], correct: 1 },
  { id: 7, text: 'Which of the following are programming languages?', type: 'multi-select', options: ['HTML', 'CSS', 'JavaScript', 'Python'], correct: [2, 3] } // New question
];

export default QuestionData;
