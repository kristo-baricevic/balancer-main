# Generated by Django 4.2.3 on 2024-03-09 20:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='uploadfile',
            name='file',
            field=models.BinaryField(null=True),
        ),
    ]
