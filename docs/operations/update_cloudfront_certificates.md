# Update CloudFront SSL Certificates

This guide covers the process for updating SSL/TLS certificates for the MINT application deployed on AWS CloudFront.

## Overview

The MINT application uses CloudFront distributions for each deployed environment (test, dev, impl, prod). SSL certificates need to be renewed periodically and updated in AWS Certificate Manager (ACM) and CloudFront.

## Prerequisites

- Access to CloudTamer
- Access to 1Password (for certificate and key storage)
- AWS Console access to CloudFront and Certificate Manager
- OpenSSL installed locally (for certificate inspection)

## Step-by-Step Process

### 1. Request Server Certificates from CMS

Request new server certificates from CMS - you'll need **one certificate for each deployed environment**:

- `test.mint.cms.gov`
- `dev.mint.cms.gov`
- `impl.mint.cms.gov`
- `mint.cms.gov` (production)

**Important:** Upload all received certificates to **1Password** for secure storage and team access.

### 2. Identify the Server Certificate

The certificate files (often `.p7b` or `.cer` format) may contain **multiple certificates bundled together** - typically three:

1. **Server certificate** (leaf certificate) - For your specific domain
2. **Intermediate CA certificate** - The CA that signed your cert
3. **Root CA certificate** - The top-level CA

#### Extract and Identify the Server Certificate

Use OpenSSL to inspect the certificate:

```bash
openssl x509 -in dev_mint_cms_gov_chain.cer -text -noout
```

Look for the **Subject** field in the output. The server certificate will have:

```
Subject: CN=dev.mint.cms.gov
```

This indicates it's the server certificate. The other two certificates will have CA names in their Subject field (e.g., `CN=HHS-FPKI-Intermediate-CA`).

**Note:** The server certificate is usually the **first certificate** in the file.

#### For .p7b Files

If you received `.p7b` files, extract all certificates first:

```bash
openssl pkcs7 -print_certs -in your_file.p7b -out all_certs.pem
```

Then identify the server certificate by examining the Subject fields as described above.

### 3. Locate the Private Key

The private key is required to import the certificate into AWS ACM.

**Important:** CMS may use an **existing/old key** to sign the new certificate and will not provide it to you. This is common practice for certificate renewals.

**Action:** Check **1Password** for existing signing keys. The private key from the previous certificate should work with the new certificate if they used the same key to generate the Certificate Signing Request (CSR).

### 4. Access AWS via CloudTamer

Navigate to **CloudTamer** and follow the authentication process.

**Repeat steps 5-13 for each environment** (test, dev, impl, prod).

### 5. Navigate to AWS Console

Once authenticated through CloudTamer, select **AWS web access** for the appropriate environment.

### 6. Open CloudFront Service

In the AWS Console:

1. Use the search bar at the top
2. Type "CloudFront"
3. Click on the **CloudFront** service

### 7. Select the Distribution

1. You'll see a list of CloudFront distributions
2. Click on the distribution for the environment you're updating
3. Each environment typically has its own distribution

### 8. Locate the SSL Certificate Settings

In the distribution dashboard:

1. Scroll to find **"Custom SSL certificate"**
2. Click on the **relevant domain** beneath it (e.g., `dev.mint.cms.gov`)
3. This will open the AWS Certificate Manager page for that certificate

### 9. Reimport the Certificate

On the Certificate Manager page:

1. Look for the **"Reimport"** button in the top right corner
2. Click **"Reimport"**

### 10. Paste the Server Certificate

In the certificate import form:

**Certificate body field:**

1. Open your `.cer` or extracted `.pem` file
2. Copy the **first certificate** in the file (the server certificate)
3. Paste into the **Certificate body** field

### 11. Paste the Private Key

In the private key field:

1. Retrieve the private key from **1Password**
2. Copy the entire key
3. Paste into the **Certificate private key** field

**Note:** If the key format doesn't match, you may need to convert it:

```bash
# Convert different key formats if needed
openssl rsa -in old_format.key -out new_format.key
```

### 12. Paste the Certificate Chain (CRITICAL)

**IMPORTANT:** You must include the **intermediate and root CA certificates** in the optional certificate chain field. Omitting this will cause **502 errors**.

**Certificate chain field:**

1. From your `.cer` file, copy the **second and third certificates** (after the server certificate)
2. These are the **intermediate CA** and **root CA** certificates
3. Paste **both certificates** into the **Certificate chain** field
4. Stack them one after another (include both complete certificate blocks)

Example format:

```
-----BEGIN CERTIFICATE-----
[Intermediate CA Certificate]
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
[Root CA Certificate]
-----END CERTIFICATE-----
```

**Troubleshooting:** If you get 502 errors after importing, the certificate chain is likely missing or incomplete. Go back and add the intermediate and root certificates to this field.

### 13. Save Changes

1. Review that all fields are filled correctly
2. Click **"Next"** or **"Reimport"** (button name may vary)
3. Confirm the changes
4. AWS will validate the certificate and key match

### 13. Verify the Certificate is Active

1. Navigate to the corresponding domain in your browser (e.g., `https://dev.mint.cms.gov`)
2. Perform a **hard cache refresh**:
   - **Chrome/Edge:** Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - **Firefox:** Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
3. Check the certificate:
   - Click the **padlock icon** in the address bar
   - View certificate details
   - Verify the **expiration date** matches your new certificate
   - Verify the **issuer** is correct

**Note:** Changes may take a minute or two to propagate through CloudFront's edge locations, but shouldn't take long.

### 14. Repeat for All Environments

Complete steps 4-13 for each environment:

- ✅ test
- ✅ dev
- ✅ impl
- ✅ prod

## Important Notes

### Certificate Requirements for CloudFront

- **Region:** Certificates for CloudFront **must** be in the **us-east-1** region (N. Virginia)
- **Private Key:** Must match the certificate's public key

### Security Best Practices

- ✅ Store all certificates and keys in **1Password**
- ✅ Never commit private keys to git repositories
- ✅ Use different certificates for each environment
- ✅ Set calendar reminders for certificate expiration (typically 1 year)
- ✅ Test in lower environments (test/dev) before updating prod

### Troubleshooting

**"Certificate and private key don't match" error:**

- Verify you're using the correct key for this certificate
- The key should be the one used to generate the CSR for this certificate
- Try the key from the previous certificate renewal

**Certificate not showing in browser:**

- Wait 2-5 minutes for CloudFront propagation
- Try clearing browser cache completely
- Try in an incognito/private window
- Check CloudFront distribution status is "Deployed"

**Certificate shows as expired:**

- Verify you copied the correct certificate (the new one, not the old)
- Check the certificate's validity dates with OpenSSL before importing

## Additional Resources

- [AWS ACM Documentation](https://docs.aws.amazon.com/acm/)
- [CloudFront SSL/TLS Documentation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-https.html)
- [Add SSL Certificate (CA Certificates)](./add_ssl_certificate.md) - For CA certificates used by the application
