import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  Paper,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import QuizIcon from "@mui/icons-material/Quiz";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

const FAQSection = () => {
  const faqData = [
    {
      title: "How to Create SOP?",
      icon: <LibraryBooksIcon color="primary" />,
      content:
        "To create an SOP, start by identifying the process you want to document, break it down into step-by-step instructions, and include necessary diagrams or visuals to clarify each step.",
    },
    {
      title: "How to Create Training Simulation",
      icon: <PlayCircleIcon color="secondary" />,
      content:
        "Training simulations provide a hands-on learning experience, allowing users to practice in a controlled environment. Use platforms like LMS to set up scenarios for effective learning. " +
        " ".repeat(100) + // For demonstration, repeating some text
        "Training simulations provide a hands-on learning experience...",
    },
    {
      title: "How to Create Document",
      icon: <DescriptionIcon color="success" />,
      content:
        "Documents are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured content.Documents are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured contentDocuments are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured contentDocuments are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured contentDocuments are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured contentDocuments are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured contentDocuments are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured contentDocuments are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured contentDocuments are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured contentDocuments are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured contentDocuments are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured contentDocuments are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured contentDocuments are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured contentDocuments are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured contentDocuments are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured contentDocuments are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured contentDocuments are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured contentDocuments are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured contentDocuments are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured contentDocuments are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured contentDocuments are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured contentDocuments are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured contentDocuments are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured contentDocuments are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured contentDocuments are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured contentDocuments are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured contentDocuments are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured contentDocuments are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured contentDocuments are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured contentDocuments are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured contentDocuments are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured contentDocuments are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured contentDocuments are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured contentDocuments are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured contentDocuments are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured contentDocuments are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured contentDocuments are essential for recording and sharing information. Use tools like Google Docs or MS Word to create professional and structured content",
    },
    {
      title: "How to Create Test Simulation",
      icon: <PlayCircleIcon color="warning" />,
      content:
        "Test simulations help users prepare for real exams by replicating test environments. Platforms like Test Simulator allow you to create time-bound tests with automated grading.",
    },
    {
      title: "How to Create Test MCQ",
      icon: <QuizIcon color="error" />,
      content:
        "Create Test MCQs by framing questions with clear, concise options. Include one correct answer and plausible distractors to ensure the quality of your assessments.",
    },
    {
      title: "How to Create Forms",
      icon: <FormatListBulletedIcon color="info" />,
      content:
        "Forms are essential for collecting user inputs. Tools like Google Forms or React Form Builder can help you design interactive forms with validation rules.",
    },
  ];

  return (
    <Box sx={{ padding: "2rem", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography
        variant="h5"
        align="start"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#3f51b5", marginBottom: "2rem" }}
      >
        Frequently Asked Questions
      </Typography>

      <Grid container spacing={3}>
        {faqData.map((faq, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Paper
              elevation={3}
              sx={{
                padding: "1rem",
                borderRadius: "8px",
                backgroundColor: "white",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <IconButton>{faq.icon}</IconButton>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {faq.title}
                </Typography>
              </Box>
              <Accordion elevation={0}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel-${index}-content`}
                  id={`panel-${index}-header`}
                >
                  <Typography variant="subtitle1" sx={{ color: "#555" }}>
                    Learn More
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    maxHeight: "250px",   // max height of 270px
                    overflowY: "auto",    // scroll if content exceeds 270px
                  }}
                >
                  <Typography variant="subtitle1" sx={{ color: "#333" }}>
                    {faq.content}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FAQSection;
