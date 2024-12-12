//contact form

function ContactForm() {
  const ENABLE_GETFORM = false; // Set to true to enable Getform, false to disable
  const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1314862616446894123/d9TpGNOl07JdLQYZY8c8eklqA721hnuCwVvwycQqyNUEebwszy9aWWDkYOiJ_KR-XYJq";


  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
    name: formData.get('name') || 'Anonymous',
    email: formData.get('email') || 'No email provided',
    message: formData.get('message') || 'No message provided',
    };

    try {
        const discordResponse = await fetch(DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `**Name:** ${data.name}\n**Email:** ${data.email}\n**Message:** ${data.message}`,
          }),
        });
      
          if (!discordResponse.ok) {
            const errorText = await discordResponse.text();
            console.error('Discord Webhook Error:', discordResponse.status, errorText);
            throw new Error('Failed to send data to Discord.');
          }
      
          alert('Data sent successfully to Discord!');

      // Google Apps Script
      const googleScriptResponse = await fetch('https://script.google.com/macros/s/AKfycbxikbS_t-s5GsHpaDlRdbIlJmtDoTMItwPXsGEScbglTpTuimlWHiujQPTzASLIYcEYxA/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!googleScriptResponse.ok) {
        console.error('Google Apps Script Response:', await googleScriptResponse.text());
        throw new Error('Failed to send data to Google Apps Script.');
      }
      console.log('Google Apps Script Response:', await googleScriptResponse.text());

      // Conditionally send data to Getform
      if (ENABLE_GETFORM) {
        const getformResponse = await fetch('https://getform.io/f/allleooa', {
          method: 'POST',
          body: formData, // FormData for compatibility
        });

        if (!getformResponse.ok) {
          console.error('Getform Response:', await getformResponse.text());
          throw new Error('Failed to send data to Getform.');
        }
        console.log('Getform Response:', await getformResponse.text());
      }

      // Success message
      alert('Data sent successfully to Discord and Google Apps Script!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send data. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="xl:pl-10 2xl:pl-20">
      <div className="md:grid md:items-center md:grid-cols-2 md:gap-2">
        <div className="mb-4">
          <label htmlFor="name" className="label">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            autoComplete="name"
            required
            placeholder="John Doe"
            className="text-field"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            autoComplete="email"
            required
            placeholder="contact@reaw.dev"
            className="text-field"
          />
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="message" className="label">
          Message
        </label>
        <textarea
          name="message"
          id="message"
          required
          placeholder="Hi!"
          className="text-field resize-y min-h-32 max-h-80"
        ></textarea>
      </div>
      <button type="submit" className="btn btn-primary [&]:max-w-full w-full justify-center">
        Send Message
      </button>
    </form>
  );
}

export default ContactForm;
