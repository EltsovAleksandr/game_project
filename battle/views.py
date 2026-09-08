from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect
from django.contrib.auth import login
from .forms import CustomUserCreationForm, CustomLoginForm

def home(request):
    return render(request, 'home.html')

def registration(request):

    if request.method == 'POST':
        form = UserCreationForm(request.POST) # передаём данные из формы

        if form.is_valid():  # проверка данных
            form.save() # создаем пользователя
            return redirect('login') # перенаправляем на страницу входа

    else:
        form = UserCreationForm() # создает пустую форму для отображения на странице

    return render(request, 'register.html', {'form': form})


def game_view(request):
    return render(request, 'index.html') # Покажи файл index.html из папки templates


def registration(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST) # указываем созданную нами форму из forms.py
        if form.is_valid():
            user = form.save(commit=False)
            user.score = form.cleaned_data['score'] # подставляется результат валидации score из forms.py
            user.save()
            return redirect('login')
    else:
        form = CustomUserCreationForm()
    return render(request, 'register.html', {'form': form})


def custom_login(request):
    if request.method == 'POST':
        form = CustomLoginForm(request, data=request.POST) # указываем созданную нами форму из forms.py
        if form.is_valid():
            user = form.get_user()
            login(request, user)

            # обновим очки
            score = form.cleaned_data['score'] # подставляется результат валидации score из forms.py
            if score > user.score: # если новый результат лучше прошлого, то обновляем результат в БД
                user.score = score
                user.save()

            return redirect('game')
    else:
        form = CustomLoginForm()
    return render(request, 'registration/login.html', {'form': form})