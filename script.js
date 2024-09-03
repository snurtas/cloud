document.getElementById('addItem').addEventListener('click', function () {
    const itemsContainer = document.getElementById('items');
    const itemCount = itemsContainer.getElementsByClassName('item').length + 1;
    const newItem = document.createElement('div');
    newItem.className = 'item';
    newItem.innerHTML = `
        <label for="itemDescription${itemCount}">Açıklama:</label>
        <input type="text" id="itemDescription${itemCount}" required>
        <label for="itemPrice${itemCount}">Fiyat:</label>
        <input type="number" id="itemPrice${itemCount}" required>
    `;
    itemsContainer.appendChild(newItem);
});

document.getElementById('invoiceForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Formdaki verileri alın
    const companyName = document.getElementById('companyName').value;
    const clientName = document.getElementById('clientName').value;
    const invoiceDate = document.getElementById('invoiceDate').value;
    const currency = document.getElementById('currency').value;
    const items = document.getElementsByClassName('item');

    // Fiyat validasyonu
    for (let i = 0; i < items.length; i++) {
        const price = parseFloat(items[i].querySelector('input[type="number"]').value);
        if (price <= 0) {
            alert("Fiyat 0'dan büyük olmalıdır.");
            return;
        }
    }

    // jsPDF ile PDF oluşturma
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Fatura Numarası
    const invoiceNumber = 'INV-' + Date.now();

    // PDF içeriğini ekleyin
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text(`${companyName} - Fatura`, 105, 20, null, null, 'center');
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Müşteri: ${clientName}`, 10, 30);
    doc.text(`Tarih: ${invoiceDate}`, 10, 40);
    doc.text(`Fatura No: ${invoiceNumber}`, 10, 50);
    doc.text('Ürün/Hizmetler:', 10, 60);
    doc.line(10, 65, 200, 65); // Çizgi ekleme

    let yOffset = 75; // Y eksenindeki başlangıç pozisyonu
    let totalPrice = 0;
    const currencySymbol = currency === 'USD' ? '$' : (currency === 'EUR' ? '€' : 'TL');

    for (let i = 0; i < items.length; i++) {
        const description = items[i].querySelector('input[type="text"]').value;
        const price = parseFloat(items[i].querySelector('input[type="number"]').value);

        if (yOffset > 280) {
            doc.addPage();
            yOffset = 10;
        }

        doc.text(`${description} - ${price.toFixed(2)} ${currencySymbol}`, 10, yOffset);
        yOffset += 10;

        totalPrice += price;
    }

    doc.setFontSize(16);
    doc.text(`Toplam: ${totalPrice.toFixed(2)} ${currencySymbol}`, 10, yOffset + 10);

    

     // PDF Önizleme
     const pdfPreview = doc.output('datauristring');
     document.getElementById('pdfPreview').src = pdfPreview;
 
   
    // PDF'i indir
    doc.save('fatura.pdf');
});

