async function generatePDF() {
    const { jsPDF } = window.jspdf;

    let studentName = document.getElementById('studentName').value;
    let teacherName = document.getElementById('teacherName').value;
    let files = document.getElementById('images').files;

    if (!studentName || !teacherName || files.length === 0) {
        alert('אנא מלא את כל השדות והעלה לפחות תמונה אחת.');
        return;
    }

    // Create a new jsPDF instance
    let pdf = new jsPDF();

    // Loop through selected images and add them to the PDF
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        let imageData = await readFileAsDataURL(file);
        
        let img = new Image();
        img.src = imageData;

        await new Promise(resolve => {
            img.onload = () => {
                let width = pdf.internal.pageSize.getWidth();
                let height = (img.height * width) / img.width;
                pdf.addImage(img, 'JPEG', 0, 0, width, height);

                // Only add a new page if there's more images
                if (i < files.length - 1) {
                    pdf.addPage();
                }
                resolve();
            };
        });
    }

    let pdfFileName = `${studentName} שיעורי בית ${teacherName}.pdf`;

    // Save the PDF file locally
    let pdfData = pdf.output('blob');
    let fileUrl = URL.createObjectURL(pdfData);

    // Set up the download link
    let link = document.getElementById('downloadLink');
    link.href = fileUrl;
    link.download = pdfFileName;
    link.style.display = 'block';

    // Enable sharing buttons
    document.querySelector('.share-btns').style.display = 'block';
}

// Helper function to read file as DataURL
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// WhatsApp share (with PDF attached)
function sendWhatsApp() {
    let file = document.getElementById('downloadLink').href;
    window.open(`https://wa.me/?text=הנה קובץ ה-PDF של שיעורי הבית: ${file}`, '_blank');
}

// Email share (with PDF attached)
function sendEmail() {
    let file = document.getElementById('downloadLink').href;
    window.open(`mailto:?subject=קובץ שיעורי בית PDF&body=הורד את קובץ ה-PDF כאן: ${file}`);
}

// Google Classroom share (with PDF attached)
function shareClassroom() {
    let file = document.getElementById('downloadLink').href;
    window.open(`https://classroom.google.com/u/0/share?url=${file}`, '_blank');
}