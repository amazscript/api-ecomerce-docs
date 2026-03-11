# MinIO Storage

LaraCommerce uses **MinIO** (or any S3-compatible provider) for storing product images and user avatars.

## Local Development with MinIO

### Install & Run MinIO

**macOS (Homebrew):**
```bash
brew install minio/stable/minio
minio server ~/minio-data --console-address ":9001"
```

**Docker:**
```bash
docker run -d \
  -p 9000:9000 \
  -p 9001:9001 \
  --name minio \
  -e MINIO_ROOT_USER=minioadmin \
  -e MINIO_ROOT_PASSWORD=minioadmin \
  minio/minio server /data --console-address ":9001"
```

### Access MinIO Console

Open `http://localhost:9001` and log in with:
- **Username:** `minioadmin`
- **Password:** `minioadmin`

### Create Buckets

Create two buckets in the console (or via the CLI):

| Bucket Name | Access Policy | Purpose |
|-------------|--------------|---------|
| `laracommerce` | Private | Product/avatar uploads |
| `laracommerce-public` | Public | Publicly accessible images |

Or via CLI:
```bash
mc alias set local http://localhost:9000 minioadmin minioadmin
mc mb local/laracommerce
mc mb local/laracommerce-public
mc anonymous set public local/laracommerce-public
```

### Environment Setup

```ini
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=laracommerce
AWS_ENDPOINT=http://localhost:9000
AWS_USE_PATH_STYLE_ENDPOINT=true
```

## Production (AWS S3)

For production, use AWS S3 — simply omit the endpoint settings:

```ini
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=your-bucket-name
```

Remove or leave empty:
```ini
# AWS_ENDPOINT=
# AWS_USE_PATH_STYLE_ENDPOINT=
```

## Storage Link

After setup, create the public storage symlink:

```bash
php artisan storage:link
```
