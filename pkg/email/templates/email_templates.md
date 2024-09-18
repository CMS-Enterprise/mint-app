# 📧 Email Templates

How to create, setup, and use email templates.


## 🏗 Email Content Structs
---

- Create a `{email_name}.go` file in `pkg/email`. The contents of this file will have 2 structs. One for the subject template and another for the body template.<br>
  **NOTE**: *If your body or subject does not have have any variable content you still need to create an empty struct.*

  ```go
    package email

    import (
      "github.com/cms-enterprise/mint-app/pkg/models"
    )

    // {EmailName}BodyContent defines the parameters necessary for the corresponding email body
    type {EmailName}BodyContent struct {
      Content type
    }

    // {EmailName}SubjectContent defines the parameters necessary for the corresponding email subject
    type {EmailName}SubjectContent struct{
      Content type
    }
  ```


## 📐 Templates
---

Email clients are notoriously bad at rendering HTML. Many clients do not support modern CSS and some HTML tags. Some clients even strip out `<head>`, `<style>`, and `<script>` tags. Because of this CSS must be inline.

For HTML email templates:
- Add [foundation-email.css ](https://github.com/foundation/foundation-emails/blob/develop/dist/foundation-emails.css) to your template.
- Use `<table>` components from [Foundation Email](https://get.foundation/emails/docs/css-guide.html) to make responsive emails and inline CSS.
- Use [Foundations inliner tool](https://get.foundation/emails/inliner.html) to inline CSS.
  - **TODO:** *Automate inlining with a CLI tool*

### Subject Template

- Create a `{email_name}_sbuject.template` file in `pkg/email/templates` with you subject line as the contents. Add your struct fields as `{{.Field}}` if you have any.
  ```plaintext
    My super awesome email subject {{.Content}}
  ```

### Body Template
- Use Foundation components to create responsive grid. The Foundation CSS can be found here [foundation-email.css ](https://github.com/foundation/foundation-emails/blob/develop/dist/foundation-emails.css)
- Create a `{email_name}_body.template` file in `pkg/email/templates/editme` with the following contents in it (you can leave the `.html` extension for easier development):

  ```html
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width">
      <title>{Email Name}</title>
      <style>
        <!--contents of foundation-email.css-->
      </style>
      <style>
        <!--custom CSS-->
      </style>
    </head>
    <body>
      <!-- Wrapper for the body of the email -->
      <table class="body" data-made-with-foundation>
        <tr>
          <!-- The class, align, and <center> tag center the container -->
          <td class="float-center" align="center" valign="top">
            <center>
              <!-- The content of your email goes here. -->
              <table class="container">
                <tr>
                  <td>
                    <!-- Row and Column components -->
                  </td>
                </tr>
              </table>
            </center>
          </td>
        </tr>
      </table>
    </body>
  </html>
  ```

- When your body template is done, inline the CSS using [Foundations inliner tool](https://get.foundation/emails/inliner.html).
- Paste the contents of your file in the `HTML` box (you don't need to worry about the `CSS` box)
- Uncheck `Compress HTML`
- Press `Inline`
- Copy Contents of `Final Email HTML` into a NEW `{email_name}_body.template` file in `pkg/email/templates`

## 🎚 Load Templates
---
- Add your templates to `pkg/email/template_service_impl.go`
  ```go
    package email

    import (
      _ "embed"
      "fmt"

      "github.com/cms-enterprise/mint-app/pkg/shared/emailtemplates"
    )

    // {emailName}TemplateName is the template name definition for the corresponding email template
    const {emailName}TemplateName string = "{email_name}"

    //go:embed templates/{email_name}_subject.template
    var {emailName}SubjectTemplate string

    //go:embed templates/{email_name}_body.template
    var {emailName}BodyTemplate string
  ```

  And in the `Load()` function

  ```go
    func (t *TemplateServiceImpl) Load() error {
      .
      .
      err = t.loadEmailTemplate({emailName}TemplateName, {emailName}Template, {emailName}BodyTemplate)
      if err != nil {
        return err
      }
      .
      .
    }
  ```

## 🖨 Generate From Templates
---
```go

  // Get the email template
  emailTemplate, err := emailTemplateImpl.GetEmailTemplate(email.{EmailName}TemplateName)

  // Generate Subject with content
	emailSubject, err := emailTemplate.GetExecutedSubject(email.DailyDigestSubjectContent{
    Content: content
  })

  // Generate Body with content
	emailBody, err := emailTemplate.GetExecutedBody(email.DailyDigestBodyContent{
		Content: content
	})
```
