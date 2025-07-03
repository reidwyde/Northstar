FROM public.ecr.aws/lambda/python:3.12-arm64

# Configure poetry to install packages in the system environment
ENV POETRY_VIRTUALENVS_CREATE=false \
    POETRY_NO_INTERACTION=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache

# Install system dependencies for building Python packages
RUN dnf update -y && \
    dnf install -y gcc gcc-c++ make git && \
    dnf clean all

# Install poetry
ENV POETRY_VERSION=1.8.2
RUN pip install poetry==${POETRY_VERSION}

# Copy pyproject.toml first for better layer caching
COPY pyproject.toml ./

# Install dependencies
RUN poetry install --only=main --no-root && \
    rm -rf $POETRY_CACHE_DIR

# Copy application code
COPY README.md ${LAMBDA_TASK_ROOT}/
COPY notification.txt ${LAMBDA_TASK_ROOT}/
COPY northstar_backend/ ${LAMBDA_TASK_ROOT}/northstar_backend/

# Set the CMD to the handler
CMD ["northstar_backend.sms_notifications.lambda_handler"]
