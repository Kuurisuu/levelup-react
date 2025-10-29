// Utilidades para generación de PDF y envío de emails
/*

TODO ESTE ARCHIVO ES PARA GENERAR EL PDF DE LA BOLETA DE COMPRA Y ENVIAR EL EMAIL CON LA BOLETA ADJUNTA

LO Q HACE AL FINAL A NIVEL TECNICO ES 
GENERAR UNA FUNCION QUE DEVUELVE UN STRING CON EL HTML DE LA BOLETA Y LUEGO USAR EL PDF.js PARA GENERAR EL PDF

*/

import { OrdenCompra, formatCLP } from './orden.helper';

/**
 * Genera un PDF de la boleta de compra
 */
export function generarPDFBoleta(orden: OrdenCompra): void {
  // Crear ventana nueva para el PDF
  const ventanaPDF = window.open('', '_blank');
  if (!ventanaPDF) {
    alert('Por favor, permite las ventanas emergentes para generar el PDF');
    return;
  }

  const html = generarHTMLBoleta(orden);
  
  ventanaPDF.document.write(html);
  ventanaPDF.document.close();
  
  // Esperar a que se cargue el contenido y luego imprimir
  ventanaPDF.onload = () => {
    ventanaPDF.focus();
    ventanaPDF.print();
  };
}

/**
 * Genera el HTML para la boleta
 */
function generarHTMLBoleta(orden: OrdenCompra): string {
  const fecha = new Date(orden.fecha).toLocaleDateString('es-CL');
  
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Boleta de Compra - ${orden.codigo}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #2c3e50;
        }
        .codigo-orden {
          font-size: 18px;
          color: #666;
          margin-top: 10px;
        }
        .section {
          margin-bottom: 25px;
        }
        .section h3 {
          background-color: #f8f9fa;
          padding: 10px;
          margin: 0 0 15px 0;
          border-left: 4px solid #007bff;
        }
        .cliente-info, .direccion-info {
          line-height: 1.6;
        }
        .productos-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }
        .productos-table th,
        .productos-table td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        .productos-table th {
          background-color: #f8f9fa;
          font-weight: bold;
        }
        .producto-imagen {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 4px;
        }
        .resumen-precios {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
        }
        .precio-linea {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          padding: 5px 0;
        }
        .precio-linea.total {
          border-top: 2px solid #333;
          font-weight: bold;
          font-size: 18px;
          margin-top: 15px;
          padding-top: 15px;
        }
        .descuento {
          color: #28a745;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #ddd;
          padding-top: 20px;
        }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">LEVEL UP</div>
        <div class="codigo-orden">Orden #${orden.codigo}</div>
        <div>Fecha: ${fecha}</div>
      </div>

      <div class="section">
        <h3>Información del Cliente</h3>
        <div class="cliente-info">
          <p><strong>Nombre:</strong> ${orden.datosEnvio.nombre} ${orden.datosEnvio.apellido}</p>
          <p><strong>Email:</strong> ${orden.datosEnvio.email}</p>
          <p><strong>Teléfono:</strong> ${orden.datosEnvio.telefono}</p>
        </div>
      </div>

      <div class="section">
        <h3>Dirección de Envío</h3>
        <div class="direccion-info">
          <p>${orden.datosEnvio.direccion}</p>
          ${orden.datosEnvio.departamento ? `<p>Depto: ${orden.datosEnvio.departamento}</p>` : ''}
          <p>${orden.datosEnvio.comuna}, ${orden.datosEnvio.region}</p>
          ${orden.datosEnvio.indicadoresEntrega ? `<p><strong>Indicadores:</strong> ${orden.datosEnvio.indicadoresEntrega}</p>` : ''}
        </div>
      </div>

      <div class="section">
        <h3>Productos Comprados</h3>
        <table class="productos-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${orden.productos.map(producto => `
                <tr>
                  <td>
           <img src="${producto.imagenUrl ? (producto.imagenUrl.startsWith('data:') ? producto.imagenUrl : producto.imagenUrl.startsWith('/') ? producto.imagenUrl : producto.imagenUrl.replace(/^\.\//, '/')) : (producto.imagen || '/img/otros/placeholder.png')}" alt="${producto.titulo || producto.nombre || 'Producto'}" class="producto-imagen" 
             onerror="this.src='/img/otros/placeholder.png'">
                  </td>
                  <td>${producto.titulo || producto.nombre || 'Sin nombre'}</td>
                <td>${formatCLP(producto.precio)}</td>
                <td>${producto.cantidad}</td>
                <td>${formatCLP(producto.precio * producto.cantidad)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="resumen-precios">
        <div class="precio-linea">
          <span>Subtotal:</span>
          <span>${formatCLP(orden.subtotal)}</span>
        </div>
        ${orden.descuento > 0 ? `
          <div class="precio-linea descuento">
            <span>Descuento (20% Duoc):</span>
            <span>-${formatCLP(orden.descuento)}</span>
          </div>
        ` : ''}
        <div class="precio-linea">
          <span>IVA (19%):</span>
          <span>${formatCLP(orden.iva)}</span>
        </div>
        <div class="precio-linea total">
          <span>Total:</span>
          <span>${formatCLP(orden.total)}</span>
        </div>
      </div>

      <div class="footer">
        <p>¡Gracias por tu compra en Level Up!</p>
        <p>Para consultas: soporte@levelup.cl | +56 9 1234 5678</p>
        <p>Este documento es tu comprobante de compra.</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Envía la boleta por email (simulación) ya que para aplicarlo realmente se necesita un backend con 
 * un servidor de email y un servicio de envío de emails. y guardar una env con datos reales etc 
 */
export function enviarBoletaPorEmail(orden: OrdenCompra): void {
  // En una implementación real, aquí se haría una llamada al backend
  // que enviaría el email con la boleta adjunta
  
  const emailData = {
    to: orden.datosEnvio.email,
    subject: `Confirmación de Compra - Orden #${orden.codigo}`,
    body: generarEmailBody(orden),
    attachments: [
      {
        filename: `boleta-${orden.codigo}.pdf`,
        content: generarHTMLBoleta(orden)
      }
    ]
  };

  // Simular envío de email
  console.log('Enviando email con datos:', emailData);
  
  // Mostrar mensaje de confirmación
  alert(`Boleta enviada por email a ${orden.datosEnvio.email}`);
}

/**
 * Genera el cuerpo del email
 */
function generarEmailBody(orden: OrdenCompra): string {
  return `
    <h2>¡Gracias por tu compra en Level Up!</h2>
    
    <p>Hola ${orden.datosEnvio.nombre},</p>
    
    <p>Tu compra ha sido procesada exitosamente. Aquí tienes los detalles:</p>
    
    <ul>
      <li><strong>Orden:</strong> #${orden.codigo}</li>
      <li><strong>Fecha:</strong> ${new Date(orden.fecha).toLocaleDateString('es-CL')}</li>
      <li><strong>Total:</strong> ${formatCLP(orden.total)}</li>
    </ul>
    
    <h3>Productos comprados:</h3>
    <ul>
      ${orden.productos.map(producto => 
        `<li>${producto.titulo || producto.nombre || 'Sin nombre'} - ${producto.cantidad} unidad(es) - ${formatCLP(producto.precio * producto.cantidad)}</li>`
      ).join('')}
    </ul>
    
    <h3>Dirección de envío:</h3>
    <p>
      ${orden.datosEnvio.direccion}<br>
      ${orden.datosEnvio.departamento ? `Depto: ${orden.datosEnvio.departamento}<br>` : ''}
      ${orden.datosEnvio.comuna}, ${orden.datosEnvio.region}
    </p>
    
    <p>Recibirás un email de seguimiento cuando tu pedido sea enviado.</p>
    
    <p>¡Gracias por elegir Level Up!</p>
    
    <hr>
    <p><small>Level Up - Tu tienda de gaming favorita</small></p>
  `;
}

/**
 * Descarga la boleta como archivo HTML
 */
export function descargarBoletaHTML(orden: OrdenCompra): void {
  const html = generarHTMLBoleta(orden);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `boleta-${orden.codigo}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
