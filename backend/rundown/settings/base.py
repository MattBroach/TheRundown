import os
import json

from django.core.exceptions import ImproperlyConfigured

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def get_env_setting(setting):
    """ Get the environment setting or return exception """
    try:
        return os.environ[setting]
    except KeyError:
        error_msg = "Set the %s env variable" % setting
        raise ImproperlyConfigured(error_msg)

SECRET_KEY = get_env_setting('DJANGO_SECRET_KEY')
JWT_SECRET = get_env_setting('TWITCH_JWT_SECRET')


INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # 3rd party packages
    'django_extensions',
    'rest_framework',
    'corsheaders',

    # Local apps
    'common',
    'channels',
    'viewers',
    'pages',
]


MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'base_templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'rundown.wsgi.application'


DATABASES = {
    'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': 'rundown_db',
            'USER': 'postgres',
            'PASSWORD': 'password',
            'HOST': 'localhost',
    }
}


AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'America/New_York'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Staticfiles Settings

STATIC_URL = '/static/'

MEDIA_URL = '/media/'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'base_static'),
)

AUTH_USER_MODEL = 'channels.Channel'

# Convenience function to always show overlay while developing, even in the view
# has already been seen
ALWAYS_SHOW_OVERLAY = False

# Cors settings
CORS_ORIGIN_ALLOW_ALL = True

EXTENSION_CLIENT_ID = get_env_setting('EXTENSION_CLIENT_ID')
TWITCH_CLIENT_ID = get_env_setting('TWITCH_CLIENT_ID')
