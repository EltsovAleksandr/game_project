from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):

    score = models.IntegerField(verbose_name = 'Очки',default = 0)
    level = models.IntegerField(verbose_name = 'Уровень', default = 1)

    class Meta:
        verbose_name = 'Игрок'
        verbose_name_plural = 'Игроки'



