import React from 'react'
import { saveAs, Paragraph, TextRun, Packer } from 'file-saver';
import { Button } from 'antd';

class ReportGeneration extends React.Component {

    generate() {
        const doc = new Document();
        const paragraph =  Paragraph("Hello World");
        const institutionText =  TextRun("Foo Bar").bold();
        const dateText =  TextRun("Github is the best").tab().bold();

        paragraph.addRun(institutionText);
        paragraph.addRun(dateText);
        doc.addParagraph(paragraph);
        
        const packer = new Packer();
        packer.toBlob(doc).then(blob => {
            console.log(blob);
            saveAs(blob, "example.docx");
            console.log("Document created successfully");
        });
    }

    render() {
        return (
            <Button type="primary" onClick={this.generate}>生成报告</Button>
        );
    }
}

export default ReportGeneration;