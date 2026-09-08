from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import CustomUser


class CustomUserCreationForm(UserCreationForm): # наследуем форму от базовой формы регистрации
    score = forms.IntegerField(
        widget=forms.HiddenInput(), # делаем поле скрытым для игрока
        required=False
    )

    class Meta(UserCreationForm.Meta): # переопределяем Meta-класс, так как используем свою модель пользователя
        model = CustomUser  # переопределяем базовую модель на нашу CustomUser
        fields = ('username', 'password1', 'password2',)  # указываем какие поля отображать пользователю

    def clean_score(self):
        score = self.cleaned_data.get('score')

        # Если score отсутствует или некорректен — ставим 0
        if score is None or not isinstance(score, int) or score < 0:
            return 0

        return score

class CustomLoginForm(AuthenticationForm): # наследуем форму от базовой формы логина
    score = forms.IntegerField(
        widget=forms.HiddenInput(), # делаем поле скрытым для игрока
        required=False
    )

    def clean_score(self):
        score = self.cleaned_data.get('score')
        if score is None or not isinstance(score, int) or score < 0:
            return 0
        return score