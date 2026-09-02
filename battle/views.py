from django.shortcuts import render
from django.contrib.auth.forms import UserCreationForm

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


